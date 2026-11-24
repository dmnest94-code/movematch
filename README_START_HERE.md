# MoveMatch SF — refreshed website (v4)

This is a **separate preview-ready version**, built from an older MoveMatch MVP and the current requested requirements. It has **not** been uploaded to GitHub, deployed, or tested against your live Netlify account. Do not replace your existing site without a backup.

## What's included
- A mobile-first landing page in `index.html` with graphite/lime styling, three residential move styles (Essential / Protected / White Glove), and a separate Commercial / Office Move section.
- A **four-step inquiry form**. Residential requests receive a preliminary move-style recommendation. **Every office move is routed only to an on-site estimate request**, requiring an on-site address and preferred walkthrough date.
- A real **Netlify Forms-ready** form named `move-request`, honeypot, error handling, a success page, and a draft privacy notice.
- A single public contact settings file `js/config.js` and print-size SVG/PNG QR codes for business cards and headrest signs.
- No fake pricing, crew-size guarantees, or fake testimonials.

## BEFORE launching (important)
1. **Check regulation/licensing**. California BHGS rules can apply to advertising, arranging, and brokering household moves, not just operating moving trucks. Confirm MoveMatch's exact legal status and any permit number/disclosures with BHGS or a knowledgeable attorney before promoting the residential service. An unlicensed broker disclaimer alone does NOT solve the permit issue. Do not imply MoveMatch has a permit or a partnership unless that is true.
2. **Edit `js/config.js`:** set your own `phoneDisplay`, `phoneE164`, `email`, and confirm `siteUrl`. These values are PUBLIC (for display); never put passwords here.
3. Review and personalize the `privacy.html` draft, including actual data handling and your business contact.
4. Verify `movematchsf.com` really points to your Netlify deployment. The domain could not be independently reached during preparation. **Do not print the QRs until the destination loads on your phone and the form passes an end-to-end test.**
5. Test at least one residential and one office inquiry end-to-end; verify both appear under **Netlify → Forms → move-request** and trigger notification emails.

## How to change the public phone/email
Open `js/config.js` in GitHub, edit the three contact strings, commit to your deployed branch, wait for the Netlify deployment to finish, then refresh the live site and check the footer and privacy page. Blank values hide the links. **This does not change where submissions are emailed.**

## How to receive inquiry emails
In Netlify select your MoveMatch site → **Forms** → **Submission notifications** → add/edit an **Email notification** for the `move-request` form. Put in the new recipient address, save and verify by submitting a test lead. Netlify Forms stores submissions separately from email notifications.

## How to deploy safely with GitHub
1. Back up the exact current repo/branch first: GitHub → repository → **Code → Download ZIP**.
2. Compare your live project directory with this folder. Keep any live integration or legal content that is not present here. The current live version could not be fetched, so avoid overwriting unseen customizations.
3. Upload `index.html`, `success.html`, `privacy.html`, `netlify.toml`, and `assets/`, `js/` folders **together** to the Netlify publish directory in a **new branch** for a Deploy Preview. If the repo already has a different publish directory, honor that setting instead of blindly adding these files to root.
4. Deploy the preview and click through **all** form steps. Confirm form detection is ON in Netlify, and form names appear after deployment. For production, merge the changes only after checks pass.
5. Submit another test request on production and validate both submission storage and recipient email delivery.
6. Use a real phone to scan the printed business-card QR; check whether its landing page and form work at night and in a slow connection.

## QR codes
- `qr/qr-business-card.png` and `.svg`: URL `https://movematchsf.com/?utm_source=uber&utm_medium=print&utm_campaign=business_card`
- `qr/qr-headrest-sign.png` and `.svg`: URL `https://movematchsf.com/?utm_source=uber&utm_medium=print&utm_campaign=headrest_sign`

These are **real, scannable** QR codes, but the domain's live availability has NOT been verified. The UTM campaign helps identify origin on submissions (`source=uber`; `campaign=business_card` or `headrest_sign`). SVG is best for professional printing. Maintain a white quiet zone and test actual size. If the website URL changes, regenerate the QR codes before printing.

## Independent checks needed
- Legal compliance for advertising and brokering moving services in California.
- True production domain, live repo source and Netlify deployment settings.
- Actual email recipient and owner phone, since those weren't supplied for this project in this request.
- Proper privacy wording and any provider agreements.

## Website mechanics
No JS frameworks, build step, external fonts, tracking SDKs, or client secrets. Website frontend cannot securely send emails by itself; Netlify Forms does that after deployment.
