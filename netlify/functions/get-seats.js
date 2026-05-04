/**
 * get-seats.js  –  Netlify Serverless Function
 *
 * Returns how many seats remain for the مذاقات البنّ workshop.
 *
 * It reads the submission count directly from the Netlify Forms API
 * so the counter stays accurate for all visitors in real-time.
 *
 * REQUIRED ENVIRONMENT VARIABLES (set in Netlify → Site → Environment):
 *   NETLIFY_PERSONAL_ACCESS_TOKEN  – a Personal Access Token from your Netlify account
 *                                    (app.netlify.com → User Settings → OAuth applications → Personal access tokens)
 *   NETLIFY_SITE_ID                – your site's API ID
 *                                    (Site → General → Site details → API ID)
 */

const TOTAL_SEATS = 15;
const FORM_NAME   = 'mazaqat-albunn-registration'; // must match the form's name attribute in index.html

exports.handler = async function (event, context) {
  // CORS headers so the page can call this function
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  };

  const apiToken = process.env.NETLIFY_PERSONAL_ACCESS_TOKEN;
  const siteId   = process.env.NETLIFY_SITE_ID;

  // If env vars not set yet (fresh deploy / local dev), return full seats
  if (!apiToken || !siteId) {
    console.warn('[get-seats] Environment variables not set. Returning full seats.');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ remaining: TOTAL_SEATS, filled: 0, total: TOTAL_SEATS }),
    };
  }

  try {
    // Fetch all forms for this site from the Netlify API
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (!res.ok) {
      throw new Error(`Netlify API error: ${res.status} ${res.statusText}`);
    }

    const forms = await res.json();

    // Find the registration form by name
    const form = forms.find((f) => f.name === FORM_NAME);

    if (!form) {
      // Form might not exist yet (no submissions yet after first deploy)
      console.info('[get-seats] Form not found yet – assuming 0 submissions.');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ remaining: TOTAL_SEATS, filled: 0, total: TOTAL_SEATS }),
      };
    }

    const filled    = Math.min(form.submission_count || 0, TOTAL_SEATS);
    const remaining = Math.max(TOTAL_SEATS - filled, 0);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ remaining, filled, total: TOTAL_SEATS }),
    };

  } catch (err) {
    console.error('[get-seats] Error:', err.message);

    // On error, return full seats so the form stays accessible
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ remaining: TOTAL_SEATS, filled: 0, total: TOTAL_SEATS, error: err.message }),
    };
  }
};
