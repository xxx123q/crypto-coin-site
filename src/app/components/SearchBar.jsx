"use client";
import {
  Box,
  TextField,
  Button,
  Paper,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function SearchBar({
  searchItem,
  setSearchItem,
  searchResults,
  showDropdown,
  setShowDropdown,
  handleSearch,
}) {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 4,
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", width: "60%" }}>
        <TextField
          label="Search for a coin..."
          variant="outlined"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          fullWidth
          sx={{ backgroundColor: "white" }}
        />

        {showDropdown && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 300,
              overflowY: "auto",
              borderRadius: 2,
              zIndex: 10,
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.slice(0, 8).map((coin, index) => (
                <Box key={coin.id}>
                  <MenuItem
                    onClick={() => {
                      setShowDropdown(false);
                      router.push(`/coin/${coin.id}`);
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 1.2,
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <img
                      src={coin.thumb}
                      alt={coin.name}
                      width={24}
                      height={24}
                      style={{ borderRadius: "50%" }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {coin.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {coin.symbol}
                      </Typography>
                    </Box>
                  </MenuItem>
                  {index < searchResults.length - 1 && (
                    <Divider sx={{ mx: 1 }} />
                  )}
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                align="center"
                sx={{ p: 2, color: "text.secondary" }}
              >
                No results found
              </Typography>
            )}
          </Paper>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ ml: 2, height: "56px" }}
        onClick={handleSearch}
        disabled={searchResults.length === 0}
      >
        Search
      </Button>
    </Box>
  );
}
