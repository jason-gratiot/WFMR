document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("address-form");
    const resultDiv = document.getElementById("result");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const addressInput = document.getElementById("address");
        const address = addressInput.value;

        resultDiv.innerHTML = '';

        // Congress API

        const proxyUrl = 'https://secure-retreat-24165-d2508f7a6075.herokuapp.com/proxy'
        const apiKey = "xc0i75PmVWfKaFNf7kOdDhoOykKesRr7jusnQqie";

        const congressUrl = `https://api.govinfo.gov/collections/crec/${address}?api_key=${apiKey}`;

        try {
            const proxyResponse = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: congressUrl,
                }),
            });
    
            const congressData = await proxyResponse.json();

            const memberOfCongress = congressData.results[0];
            const representativeName = memberOfCongress.member_full;
            const contactInfo = memberOfCongress.member_contact_form;

            const congressInfoDiv = document.getElementById("congress-info");
                congressInfoDiv.innerHTML = `
                    <h2>Member of Congress</h2>
                    <p>Name: ${representativeName}</p>
                    <p>Contact: <a href="${contactInfo}" target="_blank">Contact Form</a></p>
                `;
        } catch(error) {
            console.error("Error fetching data:", error);
            resultDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
            return;
        }

        // FEC API

        
        const openFecApiKey = "ohwHs62p89mf4GEAZgFCFCKAkc57yXmctQpz7zvY";

        const financeUrl = `https://api.open.fec.gov/v1/candidates/?q=${representativeName}&api_key=${openFecApiKey}`;

        try {
            const proxyResponseFinance = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: financeUrl,
                }),
            });
    
            const financeData = await proxyResponseFinance.json();

            const candidateData = financeData.results[0];
            const totalReceipts = candidateData.total_receipts;
            const topDonors = candidateData.top_contributors;

            const financeInfoDiv = document.getElementById("finance-info");
            financeInfoDiv.innerHTML = `
                <h2>Campaign Finance Data</h2>
                <p>Total Receipts: $${totalReceipts}</p>
                <h3>Top Donors</h3>
                <ul>
                    ${topDonors.map(donor => `<li>${donor.name}, $${donor.total}</li>`).join("")}
                </ul>
            `;

        } catch(error) {
            console.error("Error fetching data:", error);
            resultDiv.innerHTML = '<p>Error fetching FEC data. Please try again later.</p>';
        }
    });
});



