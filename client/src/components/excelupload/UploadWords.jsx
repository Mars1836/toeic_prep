"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function UploadWordExcel() {
  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);
  const [errors, setErrors] = useState([]);
  // onchange event
  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          console.log(e.target.result);
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };
  const header = ["a", "ab", "abc", "abcd"];
  const fillCols = [0, 1];

  const checkValueTable = () => {
    const check = excelData.every((item, index) => {
      const check2 = fillCols.every((col) => {
        if (!item[col]) {
          handleAddError({
            message: `The ${excelData[0][col]} field on row ${index} requires input.`,
          });
          return false;
        }
        return true;
      });
      return check2;
    });
    return check;
  };
  const checkformat = () => {
    // Check if the lengths are the same
    if (header.length !== excelData[0].length) {
      console.log("loi format");
      return; // Exit the function if the lengths don't match
    }
    const check = header.every((item, index) => {
      return item === excelData[0][index].trim();
    });
    if (!check) {
      console.log("sai format");
    }
    if (!checkValueTable()) {
      return false;
    }
  };
  const handleAddError = ({ message }) => {
    const error = {
      message,
    };
    setErrors((pre) => {
      return [...pre, error];
    });
  };
  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      let data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });
      data = data.map((row) =>
        row.map((cell) => (typeof cell === "string" ? cell.trim() : cell))
      );
      setExcelData(data);
    }
  };
  useEffect(() => {
    if (errors.length) {
      errors.forEach((error) => {
        console.log(error.message);
      });
      setErrors([]);
    }
  }, [errors]);
  return (
    <div className="wrapper">
      <h3>Upload & View Excel Sheets</h3>

      {/* form */}
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <input
          type="file"
          className="form-control"
          required
          onChange={handleFile}
        />
        <button type="submit" className="btn btn-success btn-md">
          UPLOAD
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>

      {/* view data */}
      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className="">
                  {excelData[0].map((key) => (
                    <th className="border p-4" key={key}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {excelData.map((data, index) => {
                  if (index === 0) return;
                  return (
                    <tr key={index}>
                      {Object.keys(data).map((key) => (
                        <td key={key} className="border p-4">
                          {data[key]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button className="bg-gray-700" onClick={checkformat}>
              Check table
            </button>
          </div>
        ) : (
          <div>No File is uploaded yet!</div>
        )}
      </div>
    </div>
  );
}

export default UploadWordExcel;
