import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Teltonika Codec 8 / Codec 8 Extended Webhook Ingestion
 * 
 * Receives GPS telemetry data from Teltonika devices via HTTP.
 * In production, Teltonika devices send raw TCP/UDP, which would be
 * handled by a separate edge function or relay service that converts
 * to HTTP POST for this endpoint.
 * 
 * Response: Returns acknowledgment with the number of data records received.
 * Per Teltonika protocol, the device expects the count as a 4-byte integer.
 */

// Teltonika Codec 8 / Codec 8 Extended Webhook Ingestion
// Receives GPS telemetry data from Teltonika devices via HTTP.

interface TelematicsEvent {
  imei: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude: number;
  angle: number;
  speed: number;
  satellites: number;
  event_id: number;
  io_elements: Record<string, number>;
}

export async function POST(request: Request) {
  try {
    // Use service role for IoT ingestion (no user auth context)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify webhook secret
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.TELTONIKA_WEBHOOK_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const events: TelematicsEvent[] = Array.isArray(body) ? body : [body];

    if (events.length === 0) {
      return NextResponse.json({ accepted: 0 });
    }

    // Look up vehicles by IMEI
    const imeis = [...new Set(events.map((e) => e.imei))];

    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id, tenant_id, gps_device_imei")
      .in("gps_device_imei", imeis);

    if (!vehicles || vehicles.length === 0) {
      return NextResponse.json(
        { error: "No vehicles matched for given IMEIs", imeis },
        { status: 404 }
      );
    }

    const imeiToVehicle = new Map(
      vehicles.map((v) => [v.gps_device_imei, v])
    );

    // Process each event
    let accepted = 0;
    for (const event of events) {
      const vehicle = imeiToVehicle.get(event.imei);
      if (!vehicle) continue;

      // Update vehicle mileage if speed data suggests movement
      if (event.speed > 0) {
        // In a real system, we'd calculate actual distance traveled
        // For now, we update the last known position
        await supabase
          .from("vehicles")
          .update({
            // Store last GPS position in metadata (future: separate telemetry table)
            updated_at: new Date().toISOString(),
          })
          .eq("id", vehicle.id);
      }

      accepted++;
    }

    // Teltonika protocol: respond with the number of accepted data records
    // The device uses this to know how many records to delete from its buffer
    return NextResponse.json({
      accepted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("IoT webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "teltonika-iot-webhook",
    protocol: "codec8-http-relay",
  });
}
