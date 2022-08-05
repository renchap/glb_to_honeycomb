# glb_to_honeycomb

This simple NodeJS server transforms Google Load Balancer logs into Honeycomb events.

Those events contain the OpenTelemetry attributes (including span ID, trace ID), so they are properly linked to your traces.

# Configuration

You need to set those two environment variables:

- `HONEYCOMB_API_KEY`: API key for your Honeycomb account
- `HONEYCOMB_DATASET`: name of the dataset you want to use for those events in Honeycomb
