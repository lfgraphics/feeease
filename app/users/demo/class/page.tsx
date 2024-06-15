"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface DataType {
  srNo: string;
  class: string;
  monthlyFee: string;
  examinationFee: string;
  totalStudents: string;
  paidFees: string;
  unPaidFee: string;
}

const page = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<DataType[]>([]);

  const fetchData = async () => {
    try {
      let url = `https://script.google.com/macros/s/AKfycbyGDff2qsXOihxYkOfxGPEvW45cnS0cvR6IFwKZ3fTlqOgWda9NjpwaIu8-Yp99KRDgbQ/exec?table=Classes`;

      const response = await fetch(url, { method: "GET" });
      const result = await response.json();
      console.log(result);
      setData(result.data);
      setLoading(false);
      // console.log(result.data);
    } catch (error) {
      console.error(`Failed to fetch data: ${error}`);
      setLoading(false);
    }
  };

  const createData = async () => {
    const table = "Classes";
    fetch(
      `https://script.google.com/macros/s/AKfycbyGDff2qsXOihxYkOfxGPEvW45cnS0cvR6IFwKZ3fTlqOgWda9NjpwaIu8-Yp99KRDgbQ/exec?table=${table}`,
      {
        method: "POST",
        body: JSON.stringify({
          table: "Classes",
          srNo: "9",
          class: "6th",
          monthlyFee: "500",
          examinationFee: "100",
          totalStudents: "30",
          paidFees: "15",
          unPaidFee: "15",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Data added successfully:", data);
        setLoading(false);
      })
      .catch((error) => console.error("Error adding data:", error));
    setLoading(false);
  };

  const updateRow = async (srNo: string) => {
    alert(
      "Currently we are working on this option\n Thank you for your patient"
    );
    // const table = "Classes";
    // const scriptId =
    //   "AKfycbzlHjwmtlD3oBFa1qojV3FsDFLPtQzZ88sUXOqYKCgx1AoHtoLQI3IKaW7JjnnjKu-ZNQ";
    // // Example POST request to add new data to Google Sheets via Apps Script
    // fetch(
    //   `https://script.google.com/macros/s/AKfycbwEV-nBrO40frE9VkwF0-6ZgoG6BUTPoiLysPDSZp7rkksqouTVp9uSI4T_U5ssqgOY_g/exec?table=${table}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //     body: JSON.stringify({
    //       table: "Classes",
    //       srNo: srNo,
    //       class: "5th",
    //       monthlyFee: "800",
    //       examinationFee: "200",
    //       totalStudents: "40",
    //       paidFees: "20",
    //       unPaidFee: "20",
    //     }),
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Data updated successfully:", data);
    //   })
    //   .catch((error) => console.error("Error updating data:", error));
  };

  const deleteData = async (srNo: string) => {
    const url = `https://script.google.com/macros/s/AKfycbzyFatONZexaOvHdCjzinR-TfjuJRQL6tuM8LOY37-MIzm77KdmPlCSrtmdvceBv6qVhQ/exec?table=Classes&srNo=${srNo}`;

    try {
      const response = await fetch(url, { method: "DELETE" });

      const result = await response.json();
      console.log("Data deleted successfully:", result);
      setLoading(false);
    } catch (error) {
      console.error("Error deleting data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    deleteData("8");
  }, []);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <Card x-chunk="dashboard-05-chunk-3" className="sm:ml-4">
            <CardHeader className="px-7">
              <CardTitle>Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr No.</TableHead>
                    <TableHead className="text-center">Class</TableHead>
                    <TableHead className="text-center">Monthly Fee</TableHead>
                    <TableHead className="text-center">
                      Examination Fee
                    </TableHead>
                    <TableHead className="text-center">
                      Total Students
                    </TableHead>
                    <TableHead className="text-center">Paid Fees</TableHead>
                    <TableHead className="text-center">Unpaid Fees</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-left">{row.srNo}</TableCell>
                      <TableCell className="text-center">{row.class}</TableCell>
                      <TableCell className="text-center">
                        {row.monthlyFee}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.examinationFee}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.totalStudents}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.paidFees}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.unPaidFee}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => updateRow(row.srNo)}
                            type="button"
                            className="bg-gray-500 text-white"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            type="button"
                            className="bg-red-600 text-white"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Button
            onClick={() => {
              createData();
              location.reload();
            }}
          >
            Add a dummy
          </Button>
        </>
      )}
    </>
  );
};

export default page;
