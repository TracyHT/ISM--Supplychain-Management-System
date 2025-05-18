import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import {
  Typography,
  Button,
  CircularProgress,
  Box,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Search from "../../components/Search";
import Sort from "../../components/Sort";
import Category from "../../components/Category";
import CustomPagination from "../../components/CustomPagination";
import { useNavigate } from "react-router-dom";

const ProductsWidget = ({
  userId,
  isProfile = false,
  isBookedProducts = false,
  defaultStatus = "",
}) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const token = useSelector((state) => state.token);
  const Role = useSelector((state) => state.user.role);
  const navigate = useNavigate();
  const [sort, setSort] = useState(
    JSON.parse(localStorage.getItem("productSort")) || {
      sort: "quantity",
      order: "desc",
    }
  );
  const [filterCategory, setFilterCategory] = useState(
    JSON.parse(localStorage.getItem("productFilterCategory")) || []
  );
  const [filterName, setFilterName] = useState(
    JSON.parse(localStorage.getItem("productFilterName")) || ""
  );
  const [page, setPage] = useState(
    isProfile ? 1 : parseInt(localStorage.getItem("productPage")) || 1
  );
  const [search, setSearch] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(true);

  const clearFilters = () => {
    setFilterCategory([]);
    setFilterName("");
    setPage(1);
    localStorage.removeItem("productFilterCategory");
    localStorage.removeItem("productFilterName");
  };

  const columns = [
    { label: "NAME", accessor: "name", show: true },
    { label: "CATEGORY", accessor: "category", show: true },
    { label: "PRICE", accessor: "price", show: true },
    {
      label: "SELL PRICE",
      accessor: "sellingPrice",
      show: defaultStatus === "Inventory",
    },
    { label: "QUANTITY", accessor: "quantity", show: true },
    {
      label: "MIN QTY",
      accessor: "minQuantity",
      show: !(Role === "employee" && defaultStatus === "Inventory"),
    },
    {
      label: "SOLD",
      accessor: "sold",
      show: defaultStatus === "Inventory",
    },
    {
      label: "REORDER POINT",
      accessor: "reorderPoint",
      show: !(defaultStatus === "Marketplace"),
    },
    {
      label: "ACTION",
      accessor: "actions",
      show:
        (Role === "employee" && defaultStatus === "Inventory") ||
        (Role === "supplier" && defaultStatus === "Marketplace"),
    },
  ];

  const visibleColumns = columns.filter((column) => column.show);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const filterCategoryString = filterCategory.join(",");
        const baseUrl =
          defaultStatus === "Marketplace"
            ? "http://localhost:6001/products"
            : `http://localhost:6001/inventory/${userId}/inventories`;

        const queryParams = `?page=${page}&sort=${sort.sort},${sort.order}&category=${filterCategoryString}&search=${search}&name=${filterName}`;
        const response = await fetch(`${baseUrl}${queryParams}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setProducts({ products: data }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    const getSupplierProduct = async () => {
      try {
        setLoading(true);
        const filterCategoryString = filterCategory.join(",");
        const baseUrl = `http://localhost:6001/products/${userId}/products`;
        const queryParams = `?page=${page}&sort=${sort.sort},${sort.order}&category=${filterCategoryString}&search=${search}&name=${filterName}`;
        const response = await fetch(`${baseUrl}${queryParams}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setProducts({ products: data }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    const getBookedProducts = async () => {
      try {
        setLoading(true);
        const filterCategoryString = filterCategory.join(",");
        const response = await fetch(
          `http://localhost:6001/products/${userId}/bookedproducts?page=${page}&sort=${sort.sort},${sort.order}&category=${filterCategoryString}&search=${search}&name=${filterName}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        dispatch(setProducts({ products: data }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booked products:", error);
        setLoading(false);
      }
    };

    if (Role === "supplier") {
      getSupplierProduct();
    } else if (
      defaultStatus === "Marketplace" ||
      defaultStatus === "Inventory"
    ) {
      getProducts();
    } else if (isBookedProducts) {
      getBookedProducts();
    }
  }, [
    sort,
    filterCategory,
    filterName,
    page,
    search,
    userId,
    isProfile,
    token,
    defaultStatus,
  ]);
  const isInventory = defaultStatus === "Inventory";

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    localStorage.setItem("productSort", JSON.stringify(newSort));
  };

  const handleFilterCategoryChange = (newFilterCategory) => {
    setFilterCategory(newFilterCategory);
    setPage(1);
    localStorage.setItem(
      "productFilterCategory",
      JSON.stringify(newFilterCategory)
    );
  };

  const handleFilterNameChange = (newProductName) => {
    setFilterName(newProductName);
    setPage(1);
    localStorage.setItem("productFilterName", JSON.stringify(newProductName));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    localStorage.setItem("productPage", newPage);
  };

  const handleViewDetails = (productId) => {
    console.log(defaultStatus);
    if (defaultStatus === "Marketplace")
      navigate(`/products/${productId}/product`);
    else navigate(`/inventory/${productId}/inventory`);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:6001/products/${productUserId}/${productId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      dispatch(setProducts({ product: result }));
      navigate("/delete");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Filters */}
          <Box mt={3}>
            <Box display="flex" gap={isNonMobile ? 7 : 2}>
              <Sort sort={sort} setSort={handleSortChange} />
            </Box>

            <Box mt={2} display="flex" gap={2}>
              <Search
                value={filterName}
                onChange={handleFilterNameChange}
                placeholder="Search by Product Name"
              />
            </Box>

            <Box mt={2}>
              <Category
                filterCategory={filterCategory}
                category={products.category || []}
                setFilterCategory={handleFilterCategoryChange}
              />
            </Box>

            <Box mt={2}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{
                  padding: "0.5rem 1rem",
                }}
                // sx={
                //   Role === "employee"
                //     ? {}
                //     : {
                //         fontSize: "1.25rem",
                //         padding: "12px 24px",
                //         color: "#834bff",
                //         borderColor: "#834bff",
                //         "&:hover": {
                //           color: "#fff",
                //           backgroundColor: "#834bff",
                //           borderColor: "#834bff",
                //         },
                //       }
                // }
              >
                <Typography fontSize="1rem">Clear Filters</Typography>
              </Button>
            </Box>
          </Box>

          {/* Table Display */}
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableCell
                      key={column.accessor}
                      sx={{ color: "text.secondary" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.products?.map((product) => (
                  <TableRow key={product._id}>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.accessor}>
                        {column.accessor === "name" ? (
                          <Typography
                            sx={{
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline" },
                            }}
                            onClick={() => handleViewDetails(product._id)}
                          >
                            {product.name}
                          </Typography>
                        ) : column.accessor === "actions" ? (
                          <IconButton
                            onClick={() =>
                              handleDeleteProduct(product._id, product.userId)
                            }
                            // color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        ) : column.accessor === "price" ? (
                          `$${product[column.accessor] || "N/A"}`
                        ) : (
                          product[column.accessor] || "N/A"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={4}>
            <CustomPagination
              page={page}
              limit={products.limit || 0}
              total={products.total || 0}
              setPage={handlePageChange}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProductsWidget;
