import { NextRequest, NextResponse } from "next/server";
import {
  cleanPhoneNumber,
  parseLocalPhoneMetadata,
  RawApiResponse,
} from "@/lib/phone-lookup";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawNumber = searchParams.get("number");

  if (!rawNumber || !rawNumber.trim()) {
    return NextResponse.json(
      {
        ok: false,
        query: "",
        error: "Phone number is required.",
      },
      { status: 400 }
    );
  }

  const query = rawNumber.trim();
  const cleanNumber = cleanPhoneNumber(query);

  if (cleanNumber.length < 5) {
    return NextResponse.json(
      {
        ok: false,
        query,
        cleanNumber,
        error: "Please enter a valid phone number (at least 10 digits recommended).",
      },
      { status: 400 }
    );
  }

  const apiUrl = `https://phoneinfo-ycqc.onrender.com/FetchData?Number=${encodeURIComponent(
    cleanNumber
  )}`;

  const localMetadata = parseLocalPhoneMetadata(query) ?? {
    query,
    cleanNumber,
    e164: query,
    international: query,
    national: query,
    countryCode: "IN",
    countryName: "India",
    callingCode: "91",
    numberType: "Mobile",
    valid: cleanNumber.length === 10,
    possible: true,
  };

  try {
    const controller = new AbortController();
    // 45s timeout to give Render free tier sufficient time to wake up if sleeping
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const externalResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    // If external API returned 404 (Not Found in Database)
    if (externalResponse.status === 404) {
      const errorText = await externalResponse.text().catch(() => "");
      let parsedJson: RawApiResponse = {};
      try {
        parsedJson = JSON.parse(errorText);
      } catch {
        parsedJson = { status: "not_found", phone: cleanNumber };
      }

      return NextResponse.json({
        ok: true,
        query,
        cleanNumber,
        metadata: localMetadata,
        apiData: {
          Main_Records: [],
          Alt_Records: [],
        },
        rawJson: parsedJson,
        mainCount: 0,
        altCount: 0,
        totalCount: 0,
        notFound: true,
        message: "No subscriber records found in the telecom registry for this number.",
        lookedUpAt: new Date().toISOString(),
      });
    }

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text().catch(() => "");
      let parsedError: RawApiResponse = {};
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        parsedError = { raw: errorText };
      }

      const errorMessage =
        (parsedError.message as string) ||
        (parsedError.error as string) ||
        `External service returned HTTP ${externalResponse.status}`;

      return NextResponse.json(
        {
          ok: false,
          query,
          cleanNumber,
          error: errorMessage,
          rawJson: parsedError,
          metadata: localMetadata,
        },
        { status: 200 } // Return 200 with ok: false so frontend receives clean payload without browser throwing network error
      );
    }

    const rawData: RawApiResponse = await externalResponse.json();

    // Check if body contains not_found
    if (rawData.status === "not_found") {
      return NextResponse.json({
        ok: true,
        query,
        cleanNumber,
        metadata: localMetadata,
        apiData: {
          Main_Records: [],
          Alt_Records: [],
        },
        rawJson: rawData,
        mainCount: 0,
        altCount: 0,
        totalCount: 0,
        notFound: true,
        message: "No subscriber records found in the telecom registry for this number.",
        lookedUpAt: new Date().toISOString(),
      });
    }

    const mainRecords = rawData.Data?.Main_Records || [];
    const altRecords = rawData.Data?.Alt_Records || [];
    const totalCount = mainRecords.length + altRecords.length;

    return NextResponse.json({
      ok: true,
      query,
      cleanNumber,
      metadata: localMetadata,
      apiData: {
        Main_Records: mainRecords,
        Alt_Records: altRecords,
      },
      rawJson: rawData,
      mainCount: mainRecords.length,
      altCount: altRecords.length,
      totalCount,
      notFound: totalCount === 0,
      lookedUpAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "AbortError" || error.message.includes("aborted"));

    return NextResponse.json(
      {
        ok: false,
        query,
        cleanNumber,
        error: isTimeout
          ? "Request timed out. The telecom backend on Render is currently waking up. Please try again."
          : error instanceof Error
          ? error.message
          : "Failed to connect to the external API service.",
        metadata: localMetadata,
      },
      { status: 200 }
    );
  }
}
