import { handleError, handleSuccess } from "../ulits";
const BASE_URL = "https://deploy-mi-test-api.vercel.app/enquirie";
const token = localStorage.getItem('token')

// GET all Enquiries
export const fetchEnquiries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/allenquiries`, {
        method: "POST", // default method, can be omitted
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
        }
        });
        const data = await response.json();
        return data; 
    } catch (err) {
        console.error("Error fetching materials:", err.message);
    }
};

// Add new Enquiries
export const addEnquiries = async ({ customerName, customerRefNo, kAMName, profileName, profileNo, twoD, threeD, machine, tools, fixture, stripWidth, length, type, thickness, boxPerimeter, click1, click4, shortRadiusBendingRadius, click5, longRadiusBendingRadius, click2, laserCuttingLength, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, materialIndianEquiv, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result, enquirieDate, reviewDate}) => {
    try {
          const response = await fetch(`${BASE_URL}/addenquirie`, {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ customerName, customerRefNo, kAMName, profileName, profileNo, twoD, threeD, machine, tools, fixture, stripWidth, length, type, thickness, boxPerimeter, click1, click4, shortRadiusBendingRadius, click5, longRadiusBendingRadius, click2, laserCuttingLength, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, materialIndianEquiv, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result, enquirieDate, reviewDate})
          });
          const result1 = await response.json();
          const {iD, success, message, error} = result1;
          if(success){
            handleSuccess(message)
            return iD + 1;
          }
          else if(error){
              const details = error?.details[0].message;
              handleError(details)
          }
          else if(!success) handleError(message)
        }
        catch(err) {
          console.log(err)
          handleError(err);
        }
}

// Edit Enquiries

export const editEnquiries = async ({ id, customerName, customerRefNo, kAMName, profileName, profileNo, twoD, threeD, machine, tools, fixture, click1, click4, shortRadiusBendingRadius, click5, longRadiusBendingRadius, click2, laserCuttingLength, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, materialIndianEquiv, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, computedResult, computedReviewDate}) => {     
    const response = await fetch(`${BASE_URL}/editenquirie`, {
    method: "PUT",
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    // use the computed values in the payload (not the state variables)
    body: JSON.stringify({id, customerName, customerRefNo, kAMName, profileName, profileNo, twoD, threeD, machine, tools, fixture, click1, click4, shortRadiusBendingRadius, click5, longRadiusBendingRadius, click2, laserCuttingLength, click3, powderCoatingLength, holePunching, holePunchingDetails, assemblyProcess, assemblyProcessDetails, click6, outsourceActivity, material, materialIndianEquiv, tolerance, customerSpecReq, packingSpc, sample, volumeMonthlyInTon, volumeYearlyInTon, spare, reason, statuttery, unstared, unstaredval, risk, riskReason, result: computedResult, reviewDate: computedReviewDate}),
    });

    const result = await response.json();
    return result;
}

// Delete Enquiries
export const deleteEnquiries = async ({selectedEnquiries}) => {
    try {
      const response = await fetch(`${BASE_URL}/deleteenquirie`, {
        method: "DELETE", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ selectedEnquiries: selectedEnquiries })
        });
        const result = await response.json();
        const {success, message, error} = result;
          if(success){
            handleSuccess(message);
            return true;
        }
        else if(error){
            const details = error?.details[0].message;
            handleError(details);
        }
        else if(!success) handleError(message);
    } catch (error) {
      alert("Failed to update enquiries");
    }
}

