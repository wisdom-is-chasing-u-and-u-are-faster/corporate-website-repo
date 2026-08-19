/**
 * Production HTTP Server for Google Cloud Run
 * Supports ARCH-394
 */

import { createApp } from "./app";

const PORT = process.env.PORT || 8080;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Corporate Website Lead Engine service listening on port ${PORT}`);
});
