import { GState, jsPDF } from "jspdf";
import "jspdf-autotable";

/**
 * @param {string} name - Customer name
 * @param {number} amount - Payment amount
 */
export const generateReceipt = (
  name: string,
  amount: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const innerMargin = 5;

      // Color palette - Calm yoga-inspired colors
      const colors: Record<string, [number, number, number]> = {
        sage: [120, 145, 125], // Earthy sage green
        sand: [215, 204, 185], // Warm sand color
        deepTeal: [42, 83, 89], // Deep teal for contrast
        softCream: [245, 240, 230], // Soft cream background
        darkSage: [65, 90, 70], // Darker sage for contrast elements
        terracotta: [175, 95, 75], // Earthy accent color
      };

      // Full page background
      doc.setFillColor(...colors.softCream);
      doc.roundedRect(0, 0, pageWidth, pageHeight, 5, 5, "F");

      // Add subtle background image
      const bgImageUrl = "/assets/images/yoga-bg.jpg";

      const opacities = {
        full: new GState({ opacity: 1 }),
        high: new GState({ opacity: 0.9 }),
        medium: new GState({ opacity: 0.3 }),
        low: new GState({ opacity: 0.1 }),
        veryLow: new GState({ opacity: 0.05 }),
      };

      doc.setGState(opacities.low);
      doc.addImage(bgImageUrl, "JPEG", 0, 0, pageWidth, pageHeight);
      doc.setGState(opacities.full);

      // Header area
      doc.setFillColor(...colors.sage);
      doc.rect(0, 0, pageWidth, 50, "F");

      // Create circular mask effect for logo
      const logoX = margin + 15;
      const logoY = 25;
      const logoRadius = 15;

      doc.addImage(
        "/assets/images/logo-text.png",
        65,
        -4,
        logoRadius * 6,
        logoRadius * 1.5
      );

      // Add decorative elements - gentle wave patterns
      doc.setDrawColor(...colors.sand);
      doc.setLineWidth(0.5);

      // Draw gentle waves across the top
      for (let i = 0; i < 5; i++) {
        const y = 20 + i * 3;
        const amplitude = 2.5;
        const segments = 20;

        for (let j = 0; j < segments; j++) {
          const startX = (pageWidth / segments) * j;
          const endX = (pageWidth / segments) * (j + 1);
          const startY = y + Math.sin(j * 0.5) * amplitude;
          const endY = y + Math.sin((j + 1) * 0.5) * amplitude;

          doc.line(startX, startY, endX, endY);
        }
      }

      // Add circular logo image
      const logoUrl = "/assets/images/logos.png";

      // Save the current graphics state
      doc.saveGraphicsState();

      // Draw a white circle as background for the logo
      doc.setFillColor(255, 255, 255);
      doc.circle(logoX, logoY, logoRadius, "F");

      // Create a clipping region for the circular logo
      doc.saveGraphicsState();
      doc.setGState(opacities.full);
      doc.circle(logoX, logoY, logoRadius, "F");

      // Add the logo image inside the clipping region
      doc.addImage(
        logoUrl,
        "PNG",
        logoX - logoRadius,
        logoY - logoRadius,
        logoRadius * 2,
        logoRadius * 2
      );
      doc.restoreGraphicsState();

      // Add header text
      doc.setTextColor(...colors.softCream);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Receipt", pageWidth - margin, 45, { align: "right" });

      // Add decorative line
      doc.setDrawColor(...colors.sand);
      doc.setLineWidth(0.7);
      doc.line(pageWidth / 2, 47, pageWidth - margin, 47);

      // Receipt date box
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // date section
      doc.setFillColor(...colors.sand);
      const receiptBoxY = 55;
      const receiptBoxHeight = 15;
      doc.roundedRect(
        pageWidth / 2,
        receiptBoxY,
        pageWidth / 2 - margin,
        receiptBoxHeight,
        3,
        3,
        "F"
      );

      doc.setFontSize(10);
      doc.setTextColor(...colors.deepTeal);
      const dateY = receiptBoxY + receiptBoxHeight / 2 + 1;
      const rightSpacing = 5;
      doc.text(
        `Date: ${formattedDate}`,
        pageWidth - margin - rightSpacing,
        dateY,
        { align: "right" }
      );

      // Client information section - moved up
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.deepTeal);
      doc.text("Client Information", margin, 65);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${name}`, margin, 75);

      const nameBottomMargin = 5;

      // Payment details section
      doc.setFillColor(...colors.terracotta);
      doc.setGState(opacities.low);
      doc.roundedRect(
        margin,
        85 + nameBottomMargin,
        pageWidth - 2 * margin,
        45,
        5,
        5,
        "F"
      );
      doc.setGState(opacities.full);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.deepTeal);
      doc.text("Payment Details", margin, 80 + nameBottomMargin);

      const paymentTitleBottomMargin = 5;

      const tableY = 95 + nameBottomMargin + paymentTitleBottomMargin;
      const tableWidth = pageWidth - 2 * margin - 20;
      const tableX = margin + 10;
      const tableRowHeight = 10;
      const tableHeaderHeight = 12;

      // Draw table background with rounded corners
      doc.setFillColor(...colors.deepTeal);
      doc.rect(tableX, tableY, tableWidth, tableHeaderHeight, "F");

      // Draw table header text
      doc.setTextColor(...colors.softCream);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Service", tableX + 5, tableY + 8);
      doc.text("Amount", tableX + tableWidth - 40, tableY + 8);

      // Draw table data row with rounded bottom corners
      doc.setFillColor(255, 255, 255);
      doc.rect(
        tableX,
        tableY + tableHeaderHeight,
        tableWidth,
        tableRowHeight,
        "F"
      );

      // Draw an arc in the bottom-left corner
      doc.setDrawColor(...colors.deepTeal);

      // Draw table data text
      doc.setTextColor(...colors.deepTeal);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("Yoga Seva", tableX + 5, tableY + tableHeaderHeight + 7);
      doc.text(
        `${parseFloat(amount.toString()).toFixed(2)}`,
        tableX + tableWidth - 40,
        tableY + tableHeaderHeight + 7
      );

      // Calculate final table position for next elements
      const finalTableY = tableY + tableHeaderHeight + tableRowHeight;

      // Thank you section - serene sage background
      const finalY = finalTableY + 10; // Add 10mm spacing after table
      const maxTextWidth = pageWidth - 2 * margin - 2 * innerMargin;
      const text =
        "Thank you for your monthly contribution!\n\nWe appreciate your support in sustaining our yoga community.";
      const textLines = doc.splitTextToSize(text, maxTextWidth);
      const lineHeight = 6;
      const rectHeight = 35;

      doc.setFillColor(...colors.sage);
      doc.setGState(opacities.medium);
      doc.roundedRect(
        margin,
        finalY,
        pageWidth - 2 * margin,
        rectHeight,
        5,
        5,
        "F"
      );
      doc.setGState(opacities.full);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(...colors.deepTeal);

      // Calculate vertical center position for text
      const textHeight = textLines.length * lineHeight;
      const verticalCenter =
        finalY + (rectHeight - textHeight) / 2 + lineHeight;

      doc.text(text, pageWidth / 2, verticalCenter, {
        align: "center",
        maxWidth: maxTextWidth,
      });

      // Instructor Information with signature
      const instructorY = finalY + rectHeight + 15;
      const instructorHeight = 50;

      doc.setFillColor(...colors.deepTeal);
      doc.setGState(opacities.low);
      doc.roundedRect(
        margin,
        instructorY,
        pageWidth - 2 * margin,
        instructorHeight,
        5,
        5,
        "F"
      );
      doc.setGState(opacities.full);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.deepTeal);
      doc.text("Authorized By", margin, instructorY - 5);

      // Instructor information
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Seela Koteswara Rao", margin + 5, instructorY + 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Condensed qualifications
      doc.text(
        "Seela Koteswara Rao, 30 Years Experience",
        margin + 5,
        instructorY + 25
      );
      doc.text(
        "PG Diploma Yoga, M.SC Yoga, M.SC Botany, MS Social Work",
        margin + 5,
        instructorY + 32
      );

      const signatureUrl =
        "https://cdn.pixabay.com/photo/2022/03/21/16/36/signature-7083534_1280.png";
      doc.setGState(opacities.high);
      doc.addImage(
        signatureUrl,
        "PNG",
        pageWidth - margin - 70,
        instructorY + 10,
        60,
        25
      );
      doc.setGState(opacities.full);

      const spacingBeforeFooter = 20;

      // Footer with calming teal
      const footerY = Math.max(
        instructorY + instructorHeight + spacingBeforeFooter,
        pageHeight - 20
      );
      doc.setFillColor(...colors.deepTeal);
      doc.rect(0, footerY, pageWidth, 20, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...colors.softCream);
      doc.text(
        "MoskhaVidya YogaMandir | Punyagiri Road, S Kota, Vizianagaram District | 535145 | 9989368781, 9866757311",
        pageWidth / 2 + 10,
        footerY + 11,
        { align: "center" }
      );

      // Add a subtle mandala-inspired decorative element in bottom left
      const mandalaX = 15;
      const mandalaY = footerY + 10;
      const mandalaRadius = 5;

      doc.setDrawColor(...colors.sand);
      doc.setLineWidth(0.3);

      // Draw concentric circles
      for (let i = 0; i < 3; i++) {
        doc.circle(mandalaX, mandalaY, mandalaRadius - i, "S");
      }

      // Draw radiating lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x2 = mandalaX + Math.cos(angle) * mandalaRadius * 1.5;
        const y2 = mandalaY + Math.sin(angle) * mandalaRadius * 1.5;
        doc.line(mandalaX, mandalaY, x2, y2);
      }

      // Save and download the PDF
      doc.save(`yoga_receipt_${name}.pdf`);

      resolve();
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};
