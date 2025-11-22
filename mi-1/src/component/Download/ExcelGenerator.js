import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Image from "../Image/Excel-Image.png"; // your image

export const downloadExcel = async (enquirieNo, customerName, customerRefNo, kAMName, profileName,profileNo, twoD,threeD,machine,tools,fixture,click1,click4, shortRadiusBendingRadius, shortRadiusBendingThickness, click5, longRadiusBendingRadius, longRadiusBendingThickness, click2,laserCuttingLength, laserCuttingThickness, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, materialIndianEquiv, tolerance, customerSpecReq, packingSpc, sample, volumeMonthly, volumeMonthlyInTon, volumeYearly, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result, unit1, unit2, type, stripWidth, thickness, boxPerimeter, length, enquirieDate, reviewDate) => {
  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Feasibility-L1");
  const weight = (stripWidth*thickness*7850*0.000001).toFixed(3);

  // Add sample data
  worksheet.addRow(["", "", "", "MOTHER INDIA FORMING PVT. LTD.", "", "", "", "", "", "", "", "Doc. No.", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "", "", "", "", "Rev. No.", ""]);
  worksheet.addRow(["", "", "", "Feasibility - L1", "", "", "", "", "", "", "", "Rev. Date", ""]);
  worksheet.addRow(["Customer Name:", "","", customerName , "", "", "", "", "", "Customer Ref. No.:", "", customerRefNo, ""]);
  worksheet.addRow(["Enquiry No.:", "", "", enquirieNo, "", "Enquiry Date:", "", enquirieDate, "", "Review Date", "", reviewDate, ""]);
  worksheet.addRow(["Part Name:", "", "", profileName, "", "", "", "", "", "Part No.:", "", profileNo, ""]);
  worksheet.addRow(["Feasibility consideration: Following questions were considered (all questions not mandatory). The drawings and/or specifications provided have been used as a basis for analyzing the ability to meet all specified requirements."]);
  worksheet.addRow([]);
  worksheet.addRow(["Sl. No.", "Consideration", "", "", "", "Specification", "", "", "Value", "Remarks / Action", "", "Resp.", "Target"]);
  worksheet.addRow(["1", "Drawing issued by customer,", "", "", "", "2D", "", "", twoD, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "3D", "", "", threeD, "", "", "", ""]);
  worksheet.addRow(["2", "Availability of equipments,", "", "", "", "Machine", "", "", machine, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Tools", "", "", tools, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Fixtures / Measuring Eq", "", "", fixture, "", "", "", ""]);
  worksheet.addRow(["3", "¡) In-House process involved,", "", "", "", "", "", "", "", "", "", "", ""]);
  worksheet.addRow(["", "Roll forming process", "", "", "", "Open/Non Welding section", "", "Strip width (mm)", type === "Open" ? stripWidth : "", "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "Thickness (mm)", type === "Open" ? thickness : "", "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "Weight (kg/m)", type === "Open" ? weight : "", "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Closed/Welding section", "", "Strip width (mm)", type === "Close" ? stripWidth : "", "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "Thickness (mm)", type === "Close" ? thickness : "", "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "Weight (kg/m)", type === "Close" ? weight : "", "", "", "", ""]);
  worksheet.addRow(["", "Post Forming process", "", "", "", "Bending", "Short Radius", "Radius(mm)", shortRadiusBendingRadius === 0 ? "" : shortRadiusBendingRadius, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "Thickness (mm)", shortRadiusBendingThickness === 0 ? "" : shortRadiusBendingThickness, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "Long Radius", "Radius(mm)", longRadiusBendingRadius === 0 ? "" : longRadiusBendingRadius, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "Thickness (mm)", longRadiusBendingThickness === 0 ? "" : longRadiusBendingThickness, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Laser cutting", "", "Length(mm)", laserCuttingLength === 0 ? "" : laserCuttingLength, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "", "", "Thickness (mm)", laserCuttingThickness === 0 ? "" : laserCuttingThickness, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Powder coating", "", "Length(mm)", powderCoatingLength === 0 ? "" : powderCoatingLength, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Hole Punching", "", "", holePunching ? "Yes" : "No", "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Assembly process", "", "", assemblyProcess ? "Yes" : "No", "", "", "", ""]);
  worksheet.addRow(["", "¡¡) Any outsource activity required ,", "", "", "", "", "", outsourceActivity, "", "", "", "", ""]);
  worksheet.addRow(["4", "Can engineering specifications specified by customer be met?", "", "", "", "Material", "", "", materialIndianEquiv, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "Tolerance", "", "", tolerance, "", "", "", ""]);
  worksheet.addRow(["5", "Any additional documents required?", "", "", "", "on Customer Spc. Requirement ", "", "", customerSpecReq, "", "", "", ""]);
  worksheet.addRow(["", "", "", "", "", "on Packing Spc.", "", "", packingSpc, "", "", "", ""]);
  worksheet.addRow(["6", "Any sample required from the customer?", "", "", "", "", "", "", sample, "", "", "", ""]);
  worksheet.addRow(["7", "Considering Project Volume, is spare capacity available?", "", "", "", "", "", "", spare, "", "", "", ""]);
  worksheet.addRow(["8", "Statutory and Regulatory requirements?", "", "", "", "", "", "", statuttery, "", "", "", ""]);
  worksheet.addRow(["9", "Any Unstated requirements?", "", "", "", "", "", "", unstared, "", "", "", ""]);
  worksheet.addRow(["10", "Any other points considered (Such as business Risk Etc.,)", "", "", "", "", "", "", risk, "", "", "", ""]);
  worksheet.addRow(["Conclusion:", "", "", "", "", "", "Any other concerns:", "", "", "", "", "", ""]);
  worksheet.addRow([result === 2 ? "FEASIBLE" : result === 1 ? "FEASIBLE WITH MODIFICATION" : "NOT FEASIBLE", "", "", "", "", "", "", "", "", "", "", "", ""]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow(["If it is feasible send quotation to the customer", "", "", "", "", "", "Quote Ref No.:", "", "", "", "", "", ""]);
  worksheet.addRow(["If it is feasible with modification discuss with customer", "", "", "", "", "", "Quote Ref No.:", "", "", "", "", "", ""]);
  worksheet.addRow(["In case not feasible send the regret letter / mail to customer ", "", "", "", "", "", "Letter / mail Ref:", "", "", "", "", "", ""]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow(["Note:", "", "", "", "", "", "", "", "", "", "", "", ""]);
  worksheet.addRow(["Feasibility Conclusion understanding", "", "", "", "", "", "", "", "", "", "", "", ""]);
  worksheet.addRow(["1", "FEASIBLE", "", "", "", "The product specification are well within the MI development range.", "", "", "", "", "", "", ""]);
  worksheet.addRow(["2", "FEASIBLE WITH MODIFICATION", "", "", "", "Specification are in the development range, the product development is feasible with development of tools/fixtures etc.", "", "", "", "", "", "", ""]);
  worksheet.addRow(["3", "NOT FEASIBLE", "", "", "", "The product specification are not MI development range.", "", "", "", "", "", "", ""]);

  const merges = [
    // Merge top cells
    { s: { r: 0, c: 0 }, e: { r: 2, c: 2 } },
    { s: { r: 0, c: 3 }, e: { r: 1, c: 10 } },

    { s: { r: 2, c: 3 }, e: { r: 2, c: 10 } },

    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
    { s: { r: 3, c: 3 }, e: { r: 3, c: 8 } },
    { s: { r: 3, c: 9 }, e: { r: 3, c: 10 } },
    { s: { r: 3, c: 11 }, e: { r: 3, c: 12 } },

    { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } },
    { s: { r: 4, c: 3 }, e: { r: 4, c: 4 } },
    { s: { r: 4, c: 5 }, e: { r: 4, c: 6 } },
    { s: { r: 4, c: 7 }, e: { r: 4, c: 8 } },
    { s: { r: 4, c: 9 }, e: { r: 4, c: 10 } },
    { s: { r: 4, c: 11 }, e: { r: 4, c: 12 } },

    { s: { r: 5, c: 0 }, e: { r: 5, c: 2 } },
    { s: { r: 5, c: 3 }, e: { r: 5, c: 8 } },
    { s: { r: 5, c: 9 }, e: { r: 5, c: 10 } },
    { s: { r: 5, c: 11 }, e: { r: 5, c: 12 } },

    { s: { r: 6, c: 0 }, e: { r: 7, c: 12 } },

    { s: { r: 8, c: 1 }, e: { r: 8, c: 4 } },
    { s: { r: 8, c: 5 }, e: { r: 8, c: 7 } },
    { s: { r: 8, c: 9 }, e: { r: 8, c: 10 } },

    { s: { r: 9, c: 0 }, e: { r: 10, c: 0 } },
    { s: { r: 9, c: 1 }, e: { r: 10, c: 4 } },
    { s: { r: 9, c: 5 }, e: { r: 9, c: 7 } },
    { s: { r: 9, c: 9 }, e: { r: 9, c: 10 } },

    { s: { r: 10, c: 5 }, e: { r: 10, c: 7 } },
    { s: { r: 10, c: 9 }, e: { r: 10, c: 10 } },

    { s: { r: 11, c: 0 }, e: { r: 13, c: 0 } },
    { s: { r: 11, c: 1 }, e: { r: 13, c: 4 } },
    { s: { r: 11, c: 5 }, e: { r: 11, c: 7 } },
    { s: { r: 11, c: 9 }, e: { r: 11, c: 10 } },

    { s: { r: 12, c: 5 }, e: { r: 12, c: 7 } },
    { s: { r: 12, c: 9 }, e: { r: 12, c: 10 } },

    { s: { r: 13, c: 5 }, e: { r: 13, c: 7 } },
    { s: { r: 13, c: 9 }, e: { r: 13, c: 10 } },

    { s: { r: 14, c: 0 }, e: { r: 30, c: 0 } },
    { s: { r: 14, c: 1 }, e: { r: 14, c: 7 } },
    { s: { r: 14, c: 9 }, e: { r: 14, c: 10 } },

    { s: { r: 15, c: 1 }, e: { r: 20, c: 4 } },
    { s: { r: 15, c: 5 }, e: { r: 17, c: 6 } },
    { s: { r: 15, c: 9 }, e: { r: 15, c: 10 } },

    { s: { r: 16, c: 9 }, e: { r: 16, c: 10 } },

    { s: { r: 17, c: 9 }, e: { r: 17, c: 10 } },

    { s: { r: 18, c: 5 }, e: { r: 20, c: 6 } },
    { s: { r: 18, c: 9 }, e: { r: 18, c: 10 } },

    { s: { r: 19, c: 9 }, e: { r: 19, c: 10 } },

    { s: { r: 20, c: 9 }, e: { r: 20, c: 10 } },

    { s: { r: 21, c: 1 }, e: { r: 29, c: 4 } },
    { s: { r: 21, c: 5 }, e: { r: 24, c: 5 } },
    { s: { r: 21, c: 6 }, e: { r: 22, c: 6 } },
    { s: { r: 21, c: 9 }, e: { r: 21, c: 10 } },

    { s: { r: 22, c: 9 }, e: { r: 22, c: 10 } },

    { s: { r: 23, c: 6 }, e: { r: 24, c: 6 } },
    { s: { r: 23, c: 9 }, e: { r: 23, c: 10 } },

    { s: { r: 24, c: 9 }, e: { r: 24, c: 10 } },

    { s: { r: 25, c: 5 }, e: { r: 26, c: 6 } },
    { s: { r: 25, c: 9 }, e: { r: 25, c: 10 } },

    { s: { r: 26, c: 9 }, e: { r: 26, c: 10 } },

    { s: { r: 27, c: 5 }, e: { r: 27, c: 6 } },
    { s: { r: 27, c: 9 }, e: { r: 27, c: 10 } },

    { s: { r: 28, c: 5 }, e: { r: 28, c: 7 } },
    { s: { r: 28, c: 9 }, e: { r: 28, c: 10 } },

    { s: { r: 29, c: 5 }, e: { r: 29, c: 7 } },
    { s: { r: 29, c: 9 }, e: { r: 29, c: 10 } },

    { s: { r: 30, c: 1 }, e: { r: 30, c: 7 } },
    { s: { r: 30, c: 9 }, e: { r: 30, c: 10 } },

    { s: { r: 31, c: 0 }, e: { r: 32, c: 0 } },
    { s: { r: 31, c: 1 }, e: { r: 32, c: 4 } },
    { s: { r: 31, c: 5 }, e: { r: 31, c: 7 } },
    { s: { r: 31, c: 9 }, e: { r: 31, c: 10 } },

    { s: { r: 32, c: 5 }, e: { r: 32, c: 7 } },
    { s: { r: 32, c: 9 }, e: { r: 32, c: 10 } },

    { s: { r: 33, c: 0 }, e: { r: 34, c: 0 } },
    { s: { r: 33, c: 1 }, e: { r: 34, c: 4 } },
    { s: { r: 33, c: 5 }, e: { r: 33, c: 7 } },
    { s: { r: 33, c: 9 }, e: { r: 33, c: 10 } },

    { s: { r: 34, c: 5 }, e: { r: 34, c: 7 } },
    { s: { r: 34, c: 9 }, e: { r: 34, c: 10 } },

    { s: { r: 35, c: 1 }, e: { r: 35, c: 7 } },
    { s: { r: 35, c: 9 }, e: { r: 35, c: 10 } },

    { s: { r: 36, c: 1 }, e: { r: 36, c: 7 } },
    { s: { r: 36, c: 9 }, e: { r: 36, c: 10 } },

    { s: { r: 37, c: 1 }, e: { r: 37, c: 7 } },
    { s: { r: 37, c: 9 }, e: { r: 37, c: 10 } },

    { s: { r: 38, c: 1 }, e: { r: 38, c: 7 } },
    { s: { r: 38, c: 9 }, e: { r: 38, c: 10 } },

    { s: { r: 39, c: 1 }, e: { r: 39, c: 7 } },
    { s: { r: 39, c: 9 }, e: { r: 39, c: 10 } },

    { s: { r: 40, c: 0 }, e: { r: 40, c: 5 } },
    { s: { r: 40, c: 6 }, e: { r: 40, c: 12 } },

    { s: { r: 41, c: 0 }, e: { r: 43, c: 5 } },
    { s: { r: 41, c: 6 }, e: { r: 41, c: 12 } },

    { s: { r: 42, c: 6 }, e: { r: 42, c: 12 } },

    { s: { r: 43, c: 6 }, e: { r: 43, c: 12 } },

    { s: { r: 44, c: 0 }, e: { r: 44, c: 5 } },
    { s: { r: 44, c: 6 }, e: { r: 44, c: 7 } },
    { s: { r: 44, c: 8 }, e: { r: 44, c: 12 } },

    { s: { r: 45, c: 0 }, e: { r: 45, c: 5 } },
    { s: { r: 45, c: 6 }, e: { r: 45, c: 7 } },
    { s: { r: 45, c: 8 }, e: { r: 45, c: 12 } },

    { s: { r: 46, c: 0 }, e: { r: 46, c: 5 } },
    { s: { r: 46, c: 6 }, e: { r: 46, c: 7 } },
    { s: { r: 46, c: 8 }, e: { r: 46, c: 12 } },

    { s: { r: 47, c: 0 }, e: { r: 48, c: 12 } },

    { s: { r: 49, c: 0 }, e: { r: 49, c: 12 } },

    { s: { r: 50, c: 0 }, e: { r: 50, c: 12 } },

    { s: { r: 51, c: 1 }, e: { r: 51, c: 4 } },
    { s: { r: 51, c: 5 }, e: { r: 51, c: 12 } },

    { s: { r: 52, c: 1 }, e: { r: 52, c: 4 } },
    { s: { r: 52, c: 5 }, e: { r: 52, c: 12 } },

    { s: { r: 53, c: 1 }, e: { r: 53, c: 4 } },
    { s: { r: 53, c: 5 }, e: { r: 53, c: 12 } },
  ]

  merges.forEach((merge) => {
    worksheet.mergeCells(
      merge.s.r + 1,
      merge.s.c + 1,
      merge.e.r + 1,
      merge.e.c + 1
    );
  });

  const headerStyle = {
    alignment: { horizontal: "center", vertical: "center" },
    font: { bold: true },
    alignment: {
      wrapText: true, // 🔹 Enables vertical folding
      horizontal: "center",
      vertical: "center",
   },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Apply style to A1:M53
  for (let r = 1; r <= 54; r++) {
    for (let c = 1; c <= 13; c++) {
      const cell = worksheet.getCell(r, c);
      cell.style = JSON.parse(JSON.stringify(headerStyle));
    }
  }

  // Fetch the image as a Blob
  const response = await fetch(Image);
  const imageBlob = await response.blob();
  const arrayBuffer = await imageBlob.arrayBuffer();

  // Add the image to workbook
  const imageId = workbook.addImage({
    buffer: arrayBuffer,
    extension: "png",
  });

  // Position image over cell A1
  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 }, // top-left position
    br: { col: 3, row: 3 },   // bottom-right corner (covers 3 columns × 3 rows)
    editAs: 'oneCell', 
  });
  
  worksheet.eachRow((Row, rowNumber) => {
    Row.eachCell((Cell, colNumber) => {
      const value = Cell.value;
      const cell = Cell.address;
      // Green (Feasible)
      if (value === "FEASIBLE" ||value === "Available" || value === "Not Required" || value === "Low" || value === "Achivable" || value === "Greater than 0.5" || (cell === "I38" && value === "No") || (cell === "I37" && (value === "Yes, & Complied" || value === "No")) || (cell === "I36" && value === "Yes") || value === "MI Standard" || (cell === "I28" && value === "No") || (cell === "I29" && value === "No") || (cell === "I15" && (type === "Open" && (stripWidth > 10 && stripWidth <= 220))) || (cell === "I16" && (type === "Open" && (thickness > 0.4 && thickness <= 4))) || (cell === "I18" && (type === "Close" && (stripWidth > 10 && stripWidth <= 350))) || (cell === "I19" && (type === "Close" && (thickness > 0.8 && thickness <= 4))) || (cell === "I21" && click1 && click4 && (shortRadiusBendingRadius > 40 && shortRadiusBendingRadius <=400)) || (cell === "I22" && click1 && click4 && (shortRadiusBendingThickness > 0.8 && shortRadiusBendingThickness <= 6)) || (cell === "I23" && click1 && click5 && (longRadiusBendingRadius > 400 && longRadiusBendingRadius <= 10000)) || (cell === "I24" && click1 && click5 && (longRadiusBendingThickness > 40 && longRadiusBendingThickness <=400)) || (cell === "I25" && click2 && (laserCuttingLength > 10 && laserCuttingLength <=3000)) || (cell === "I26" && click2 && (laserCuttingThickness > 0.8 && laserCuttingThickness <=10)) || (cell === "I27" && click3 && (powderCoatingLength > 200 && powderCoatingLength <= 3000))) {
        Cell.fill = {type: "pattern", pattern: "solid", fgColor: { argb: "FF93C572" },};
      }
      // Yellow (Feasible with Modification)
      else if (value === "FEASIBLE WITH MODIFICATION" || value === "To be developed" || value === "Need detailed study" || value === "0.1 - 0.5" || (cell === "I38" && value === "Yes") || (cell === "I37" && value === "Yes, Will be complied") || (cell === "I36" && value === "No") || (cell === "I35" && value === "Essential to proceed") || value === "Customer Specific" || (cell === "I28" && value === "Yes") || (cell === "I29" && value === "Yes")) {
        Cell.fill = {type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF2E" },};
      }
      // Red (Not Feasible)
      else if (value === "NOT FEASIBLE" ||value === "Not Available" || value === "High" || value === "Essential to proceed" || value === "Regret" || value === "Less than 0.1" || value === "Not Achivable" || (cell === "I37" && value === "Cannot comply") || (cell === "I15" && (type === "Open" && (stripWidth <= 10 || stripWidth > 220))) || (cell === "I16" && (type === "Open" && (thickness <= 0.4 || thickness > 4))) || (cell === "I18" && (type === "Close" && (stripWidth <= 10 || stripWidth > 350))) || (cell === "I19" && (type === "Close" && (thickness <= 0.8 || thickness > 4))) || (cell === "I21" && click1 && click4 && (shortRadiusBendingRadius <= 40 || shortRadiusBendingRadius > 400)) || (cell === "I22" && click1 && click4 && (shortRadiusBendingThickness <= 0.8 || shortRadiusBendingThickness > 6)) || (cell === "I23" && click1 && click5 && (longRadiusBendingRadius <= 400 || longRadiusBendingRadius > 10000)) || (cell === "I24" && click1 && click5 && (longRadiusBendingThickness <= 400 || longRadiusBendingThickness > 10000)) || (cell === "I25" && click2 && (laserCuttingLength <= 10 || laserCuttingLength > 3000)) || (cell === "I26" && click2 && (laserCuttingThickness <= 0.8 || laserCuttingThickness > 10)) || (cell === "I27" && click3 && (powderCoatingLength <= 200 || powderCoatingLength > 3000))) {
        Cell.fill = {type: "pattern", pattern: "solid", fgColor: { argb: "FFFF2E2E" },};
      }
      // Grey (Header and Merged Cells)
      else if(cell === "D1" || cell === "D3" || cell === "L1" || cell === "M1" || cell === "L2" || cell === "M2" || cell === "L3" || cell === "M3" || cell === "A4" || cell === "J4" || cell === "A5" || cell === "F5" || cell === "J5" || cell === "A6" || cell === "J6" || cell === "A7" || cell === "A9" || cell === "B9" || cell === "F9" || cell === "I9" || cell === "J9" || cell === "L9" || cell === "M9" || cell === "A10" || cell === "B10" || cell === "F10" || cell === "F11" || cell === "A12" || cell === "B12" || cell === "F12" || cell === "F13" || cell === "F14" || cell === "A15" || cell === "B15" || cell === "B16" || cell === "F16" || cell === "H16" || cell === "H17" || cell === "H18" || cell === "F19" || cell === "H19" || cell === "H20" || cell === "H21" || cell === "B22" || cell === "F22" || cell === "G22" || cell === "H22" || cell === "H23" || cell === "G24" || cell === "H24" || cell === "H25" || cell === "F26" || cell === "H26" || cell === "H27" || cell === "F28" || cell === "H28" || cell === "F29" || cell === "F30" || cell === "B31" || cell === "A32" || cell === "B32" || cell === "F32" || cell === "F33" || cell === "A34" || cell === "B34" || cell === "F34" || cell === "F35" || cell === "A36" || cell === "B36" || cell === "A37" || cell === "B37" || cell === "A38" || cell === "B38" || cell === "A39" || cell === "B39" || cell === "A40" || cell === "B40" || cell === "A41" || cell === "G41" || cell === "A45" || cell === "G45" || cell === "A46" || cell === "G46" || cell === "A47" || cell === "G47") {
        Cell.fill = {type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" },};
      }
      // Optional: Borders and alignment
      Cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      Cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });
  });

  // Generate Excel and save
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Feasibility-L1.xlsx");
};

