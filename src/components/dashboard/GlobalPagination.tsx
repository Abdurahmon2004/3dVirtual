import React from "react";
import { Box, Pagination, Typography } from "@mui/material";

const GlobalPagination = ({ page, perPage, total, onPageChange }:{page:number, perPage:number, total:number, onPageChange:any}) => {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null; 

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 3,
        p: 2,
        borderTop: "none",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {`Sahifa ${page} / ${totalPages}`}
      </Typography>

      <Pagination
        color="primary"
        count={totalPages}
        page={page}
        onChange={(e, newPage) => onPageChange(newPage)}
        shape="rounded"
        size="medium"
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "8px",
          },
        }}
      />
    </Box>
  );
};

export default GlobalPagination;
