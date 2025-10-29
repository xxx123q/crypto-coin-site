"use client";
import { Box, Pagination } from "@mui/material";

export default function PaginationBar({ totalPages, page, setPage, setError }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => {
          setError(null);
          setPage(value);
        }}
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
}
