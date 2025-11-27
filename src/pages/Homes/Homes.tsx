import React, { useState, ChangeEvent } from "react";
import { useDeleteHome, useHomes } from "@/hooks/modules/home";
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Fab,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Drawer,
  TableHead,
  TableRow,
  Fade,
  CircularProgress,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  Table,
} from "@mui/material";
import { useGetCompaniesInfinite } from "@/hooks/modules/companies";
import { useGetObjectsInfinite } from "@/hooks/modules/object";
import { useBlocks } from "@/hooks/modules/block";
import { Link } from "react-router";
import GlobalPagination from "@/components/dashboard/GlobalPagination";

type OrderType = "asc" | "desc" | "";

type Filters = {
  company_id: string;
  object_id: string;
  block_id: string;
  is_active: boolean;
  is_repaired: boolean;
  is_residential: boolean;
  search: string;
  sort: string;
  order: OrderType;
  per_page: number;
};

const defaultFilters: Filters = {
  company_id: "",
  object_id: "",
  block_id: "",
  is_active: false,
  is_repaired: false,
  is_residential: false,
  search: "",
  sort: "",
  order: "",
  per_page: 10,
};

type Company = { id: number | string; name: string };
type Obj = { id: number | string; name: string };
type Block = { id: number | string; name: string };

const Homes: React.FC = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState<number>(1)
  const { data: homes, isLoading, refetch } = useHomes(filters);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: name === "per_page" ? Number(value) || 0 : value,
    }));
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const { data: companies } = useGetCompaniesInfinite();
  const companyList: Company[] =
    companies?.pages?.flatMap((p: { data: Company[] }) => p.data) ?? [];

  const { data: objects } = useGetObjectsInfinite();
  const objectList: Obj[] =
    objects?.pages?.flatMap((p: { data: Obj[] }) => p.data) ?? [];

  const { data: blocks } = useBlocks({});
  const blockList: Block[] = (blocks?.data as Block[]) ?? [];
  const sortLabels: Record<string, string> = {
    id: "ID bo‘yicha",
    number: "Raqam bo‘yicha",
    square: "Maydon bo‘yicha",
    created_at: "Yaratilgan sana",
    updated_at: "Yangilangan sana",
  };
  const { mutate: deleteHome } = useDeleteHome();
  const handleDelete = (id: number) => {
    deleteHome(id, {
      onSuccess: () => {
        refetch()
      }
    })
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={600}>
          Uylar
        </Typography>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <TextField
            size="small"
            placeholder="Qidiruv..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            sx={{ width: 200 }}
          />

          <Button
            color="primary"
            variant="outlined"
            onClick={() => setOpenFilter(true)}
          >
            <i className="fa-solid fa-filter"></i> Filter
          </Button>

          <Link to="/settings/home-create" >
            <Fab color="primary" size="medium">
              <Add />
            </Fab>
          </Link>
        </div>
      </Box>
      {isLoading ? (
        <Box textAlign="center" p={5}>
          <CircularProgress />
        </Box>
      ) : homes?.data?.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="body1" color="text.secondary">
            Xonadonlar mavjud emas!
          </Typography>
        </Box>
      ) : (
        <>
          <Fade in>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>№</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Blok</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Qavat</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Maydon (m²)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ta’mirlangan</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ta’mirsiz</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tamir holati</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Turar joy</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Holat</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                    Amallar
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {homes?.data?.map((item: any, idx: number) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f9fafb" },
                      transition: "0.2s",
                    }}
                  >
                    <TableCell>{idx + 1 + (page - 1) * homes.per_page}</TableCell>

                    <TableCell>{item.number}</TableCell>

                    <TableCell>{item.block?.name || "-"}</TableCell>

                    <TableCell>{item.stage ?? "-"}</TableCell>

                    <TableCell>{item.square} m²</TableCell>

                    <TableCell>{item.price_repaired}</TableCell>

                    <TableCell>{item.price_no_repaired}</TableCell>

                    <TableCell>
                      {item.is_repaired ? (
                        <Chip label="Ha" color="success" size="small" />
                      ) : (
                        <Chip label="Yo‘q" size="small" />
                      )}
                    </TableCell>

                    <TableCell>
                      {item.is_residential ? (
                        <Chip label="Turar joy" color="primary" size="small" />
                      ) : (
                        <Chip label="Noturar" size="small" />
                      )}
                    </TableCell>

                    <TableCell>
                      {item.is_active ? (
                        <Chip label="Aktiv" color="success" size="small" />
                      ) : (
                        <Chip label="Aktiv emas" size="small" />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {/* <Tooltip title="Tahrirlash">
                        <IconButton color="primary" onClick={() => { }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip> */}

                      <Tooltip title="O‘chirish">
                        <IconButton color="error" onClick={() => { handleDelete(item.id) }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Fade>

          <GlobalPagination
            page={page}
            perPage={homes.per_page}
            total={homes.total}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Drawer — Filter Modal */}
      <Drawer anchor="right" open={openFilter} onClose={() => setOpenFilter(false)}>
        <Box sx={{ width: 340, p: 2, overflowY: "auto" }}>
          <Typography variant="h6" mb={2} fontWeight={600}>
            Filtrlar
          </Typography>

          {/* Company */}
          <TextField
            fullWidth
            size="small"
            label="Kompaniya"
            name="company_id"
            select
            value={filters.company_id}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Tanlanmagan</MenuItem>
            {companyList.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Object */}
          <TextField
            fullWidth
            size="small"
            label="Obyekt"
            name="object_id"
            select
            value={filters.object_id}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Tanlanmagan</MenuItem>
            {objectList.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Block */}
          <TextField
            fullWidth
            size="small"
            label="Blok"
            name="block_id"
            select
            value={filters.block_id}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Tanlanmagan</MenuItem>
            {blockList.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Search */}
          <TextField
            fullWidth
            size="small"
            label="Qidiruv"
            name="search"
            value={filters.search}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* Sort */}
          <TextField
            fullWidth
            size="small"
            label="Saralash"
            name="sort"
            select
            value={filters.sort}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Tanlanmagan</MenuItem>
            {Object.keys(sortLabels).map((key) => (
              <MenuItem key={key} value={key}>
                {sortLabels[key]}
              </MenuItem>
            ))}
          </TextField>


          {/* Order */}
          <TextField
            fullWidth
            size="small"
            label="Tartib"
            name="order"
            select
            value={filters.order}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Tanlanmagan</MenuItem>
            <MenuItem value="asc">O‘suvchi (ASC)</MenuItem>
            <MenuItem value="desc">Kamayuvchi (DESC)</MenuItem>
          </TextField>

          {/* Per Page */}
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Sahifada soni"
            name="per_page"
            value={filters.per_page}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* Checkboxes */}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="is_active"
                checked={filters.is_active}
                onChange={handleCheckbox}
              />
            }
            label="Faol"
            sx={{ mb: -1 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="is_repaired"
                checked={filters.is_repaired}
                onChange={handleCheckbox}
              />
            }
            label="Ta’mirlangan"
            sx={{ mb: -1 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="is_residential"
                checked={filters.is_residential}
                onChange={handleCheckbox}
              />
            }
            label="Yashash uchun"
          />

          {/* Buttons */}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="text" color="error" onClick={resetFilters}>
              Tozalash
            </Button>
            <Button variant="contained" onClick={() => setOpenFilter(false)}>
              Qo‘llash
            </Button>
          </Box>
        </Box>
      </Drawer>


    </>
  );
};

export default Homes;
