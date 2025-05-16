import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

export default function GlobalTable({
  columns,
  rows,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions=[10, 15, 25]
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: "none", padding: "20px 20px" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                sx={{
                  color: "#7783c5",
                  borderColor: "#f5efee",
                  padding: "10px 0",
                  width: column?.width, 
                }}
                key={column.field}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell
                  sx={{
                    borderColor: "#f5efee",
                    padding: "10px 0",
                  }}
                  key={column.field}
                >
                  {row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {total > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={page} 
          onPageChange={onPageChange} 
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange(parseInt(e.target.value))
          }
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </TableContainer>
  );
}
