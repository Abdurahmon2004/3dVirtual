import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
} from "@mui/material";
import { Add, Remove, CloudUpload } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setImages } from "../store/features/imagesSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

interface FaceImages {
  px: File | null;
  nx: File | null;
  py: File | null;
  ny: File | null;
  pz: File | null;
  nz: File | null;
}

interface FormData {
  name: string;
  faces: FaceImages;
  previews: {
    px: string;
    nx: string;
    py: string;
    ny: string;
    pz: string;
    nz: string;
  };
  error?: string;
}

const AddImages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan_id = searchParams.get("plan_id");
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [forms, setForms] = useState<FormData[]>([
    {
      name: "",
      faces: { px: null, nx: null, py: null, ny: null, pz: null, nz: null },
      previews: { px: "", nx: "", py: "", ny: "", pz: "", nz: "" },
    },
  ]);

  const faceLabels = {
    px: "O'ng tomon (px)",
    nx: "Chap tomon (nx)",
    py: "Yuqori tomon (py)",
    ny: "Pastki tomon (ny)",
    pz: "Old tomon (pz)",
    nz: "Orqa tomon (nz)",
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...forms];
    updated[index].name = value;
    setForms(updated);
  };

  const handleFileChange = (
    index: number,
    face: keyof FaceImages,
    file: File | null
  ) => {
    if (!file) return;

    const updated = [...forms];
    updated[index].faces[face] = file;
    updated[index].previews[face] = URL.createObjectURL(file);
    updated[index].error = undefined;
    setForms(updated);
  };

  const handleAddForm = () => {
    setForms([
      ...forms,
      {
        name: "",
        faces: { px: null, nx: null, py: null, ny: null, pz: null, nz: null },
        previews: { px: "", nx: "", py: "", ny: "", pz: "", nz: "" },
      },
    ]);
  };

  const handleRemoveForm = (index: number) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const f of forms) {
      if (!f.name.trim()) {
        alert("Xona nomini kiriting!");
        return;
      }

      const allFaces = Object.values(f.faces);
      if (allFaces.some((face) => !face)) {
        alert("Har bir formda barcha 6 ta rasmni yuklash kerak!");
        return;
      }
    }

    // Convert to the format expected by Redux
    const formattedData = forms.map((form) => ({
      name: form.name,
      textures: [
        form.faces.px!,
        form.faces.nx!,
        form.faces.py!,
        form.faces.ny!,
        form.faces.pz!,
        form.faces.nz!,
      ],
      previews: [
        form.previews.px,
        form.previews.nx,
        form.previews.py,
        form.previews.ny,
        form.previews.pz,
        form.previews.nz,
      ],
    }));

    dispatch(setImages(formattedData));
    setForms([
      {
        name: "",
        faces: { px: null, nx: null, py: null, ny: null, pz: null, nz: null },
        previews: { px: "", nx: "", py: "", ny: "", pz: "", nz: "" },
      },
    ]);
    navigator(`/add-vizual?plan_id=${plan_id}`);
  };

  return (
    <div className="shadow-lg rounded-xl ">
      <Box sx={{ p: 1, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🖼️ Vizual uchun rasm va ma'lumot qo'shish
        </Typography>

        <form onSubmit={handleSubmit}>
          {forms.map((form, index) => (
            <Card
              key={index}
              sx={{
                mb: 3,
                p: 0,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Grid>
                    <TextField
                      label="Xona nomi"
                      required
                      fullWidth
                      variant="outlined"
                      value={form.name}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                  </Grid>

                  <Grid container spacing={2}>
                    {(Object.keys(faceLabels) as Array<keyof FaceImages>).map(
                      (faceKey) => (
                        <Grid key={faceKey}>
                          <Box
                            sx={{
                              border: "2px dashed #9e9e9e",
                              borderRadius: 3,
                              p: 2,
                              textAlign: "center",
                              transition: "0.2s ease",
                              minHeight: 200,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {form.previews[faceKey] ? (
                              <Box sx={{ width: "100%", height: "100%" }}>
                                <img
                                  src={form.previews[faceKey]}
                                  alt={faceLabels[faceKey]}
                                  style={{
                                    width: "100%",
                                    height: 140,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ mt: 1, display: "block", color: "green" }}
                                >
                                  ✓ Yuklandi
                                </Typography>
                              </Box>
                            ) : (
                              <>
                                <CloudUpload
                                  sx={{ fontSize: 32, color: "gray", mb: 1 }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ mb: 1, fontWeight: 500 }}
                                >
                                  {faceLabels[faceKey]}
                                </Typography>
                              </>
                            )}

                            <Button
                              variant="contained"
                              component="label"
                              size="small"
                              sx={{ mt: 1 }}
                            >
                              {form.faces[faceKey] ? "O'zgartirish" : "Tanlash"}
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                  handleFileChange(
                                    index,
                                    faceKey,
                                    e.target.files?.[0] || null
                                  )
                                }
                              />
                            </Button>
                          </Box>
                        </Grid>
                      )
                    )}
                  </Grid>

                  {form.error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {form.error}
                    </Alert>
                  )}

                  <Grid>
                    <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                      {forms.length > 1 && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveForm(index)}
                        >
                          <Remove />
                        </Button>
                      )}
                      {index === forms.length - 1 && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={handleAddForm}
                        >
                          <Add />
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Yuborish
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default AddImages;