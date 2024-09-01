// script.js

document.addEventListener('DOMContentLoaded', () => {
    const mouForm = document.getElementById('mouForm');
    const mouDocument = document.getElementById('mouDocument');
    const downloadBtn = document.getElementById('downloadBtn');

    mouForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const buyerName = document.getElementById('buyerName').value;
        const buyerId = document.getElementById('buyerId').value;
        const sellerName = document.getElementById('sellerName').value;
        const sellerId = document.getElementById('sellerId').value;
        const itemName = document.getElementById('itemName').value;
        const quantity = document.getElementById('quantity').value;
        const amount = document.getElementById('amount').value;

        // Generate MOU document HTML with Privacy & Policy
        const mouContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
                <img src="logo.jpeg" alt="Company Logo" style="width: 100px; float: right; margin-left: 20px; margin-top: 20px;">
                <h1 style="text-align: center; color: #0056b3;">Memorandum of Understanding (MOU)</h1>
                <p><strong>Buyer Name:</strong> ${buyerName}</p>
                <p><strong>Buyer ID:</strong> ${buyerId}</p>
                <p><strong>Seller Name:</strong> ${sellerName}</p>
                <p><strong>Seller ID:</strong> ${sellerId}</p>
                <p><strong>Item Name:</strong> ${itemName}</p>
                <p><strong>Quantity:</strong> ${quantity}</p>
                <p><strong>Amount:</strong> $${amount}</p>
                <br>
                <h2 style="color: #0056b3;">Privacy & Policy</h2>
                <ul>
                    <li><strong>Privacy Policy:</strong> We are committed to protecting your privacy. Your personal information, including but not limited to your name, contact details, and contract information, will be collected and used solely for the purposes of processing your contract, facilitating communication between you and our team, and ensuring secure transactions. We will not share your data with third parties without your explicit consent, except as required by law or to fulfill contractual obligations.</li>
                    <li><strong>Buying and Selling Farming Product Policy:</strong> All transactions conducted through our platform are subject to our terms and conditions. Products must meet the quality standards specified in the contract, which will be determined through inspections or quality assessments. Payments will be made according to the agreed-upon terms, including payment schedules and methods. Disputes arising from the contract will be resolved through mediation or arbitration, as outlined in our dispute resolution procedures. We reserve the right to terminate contracts for non-compliance with the terms and conditions or for breach of contract.</li>
                </ul>
                <br>
                <img src="Sign.jpeg" alt="Signature" style="width: 150px; float: left; margin-right: 20px;">
                <img src="Seal.webp" alt="Seal" style="width: 100px; float: right;">
                <p style="clear: both;">This MOU is binding and shall be governed by the terms and conditions agreed upon by both parties.</p>
                <p><em>Signed on this date:</em> ${new Date().toLocaleDateString()}</p>
            </div>
        `;

        // Display the MOU content
        mouDocument.innerHTML = mouContent;
        mouDocument.style.display = 'block';
        downloadBtn.disabled = false;

        // Function to generate PDF
        async function generatePDF() {
            try {
                // Wait for images to load
                const images = document.querySelectorAll('img');
                await Promise.all(Array.from(images).map(img => new Promise((resolve, reject) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                        img.onerror = reject;
                    }
                })));

                // Capture the content of the MOU document
                html2canvas(mouDocument, { allowTaint: true, useCORS: true }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4'); // Use 'mm' for units and 'a4' for paper size

                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 295; // A4 height in mm
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    pdf.save('MOU.pdf');
                }).catch(error => {
                    console.error('Error during html2canvas processing:', error);
                });
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }

        // Add click event to the download button
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default button behavior
            generatePDF();
        });
    });
});
