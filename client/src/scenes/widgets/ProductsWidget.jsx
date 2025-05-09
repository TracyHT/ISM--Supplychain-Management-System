import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import { Typography, Button, CircularProgress, Grid } from "@mui/material";
import Search from "../../components/Search";
import Sort from "../../components/Sort";
import Category from "../../components/Category";
import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/material";
import CustomPagination from "../../components/CustomPagination";
import ProductWidget from "./ProductWidget";

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

  // Cập nhật `useEffect` để kiểm tra `defaultStatus` và gọi API phù hợp
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const filterCategoryString = filterCategory.join(",");

        const baseUrl =
          defaultStatus === "Marketplace"
            ? "http://localhost:6001/products"
            : `http://localhost:6001/inventory/${userId}/inventory`; // Gọi API cho Inventory

        const queryParams = `?page=${page}&sort=${sort.sort},${sort.order}&category=${filterCategoryString}&search=${search}&name=${filterName}`;

        const response = await fetch(`${baseUrl}${queryParams}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        console.log("Inventory data:", data);
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
        console.log("Inventory data:", data);
        dispatch(setProducts({ products: data }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    const getBookedProducts = async () => {
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
    };

    // Điều kiện gọi API tùy thuộc vào `defaultStatus`
    if (Role === "supplier") {
      getSupplierProduct();
    } else if (defaultStatus === "Marketplace") {
      getProducts();
    } else if (defaultStatus === "Inventory") {
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
    defaultStatus, // Re-run effect nếu `defaultStatus` thay đổi
  ]);

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
            <Box display={"flex"} gap={isNonMobile ? 7 : 2}>
              <Box>
                <Sort sort={sort} setSort={handleSortChange} />
              </Box>
            </Box>
            <Box mt={2}>
              {/* First row of search inputs */}
              <Box display="flex" gap={2} mb={2}>
                <Search
                  value={filterName}
                  onChange={handleFilterNameChange}
                  placeholder="Search by Product Name"
                />
              </Box>
            </Box>

            <Box mt={2}>
              <Category
                filterCategory={filterCategory}
                category={products.category ? products.category : []}
                setFilterCategory={handleFilterCategoryChange}
              />
            </Box>

            <Box mt={2}>
              {Role === "employee" ? (
                <Button variant="outlined" onClick={clearFilters}>
                  <Typography fontSize={"1rem"}> Clear Filters</Typography>
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    fontSize: "1.25rem",
                    padding: "12px 24px",
                    color: "#834bff",
                    borderColor: "#834bff",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "#834bff",
                      borderColor: "#834bff",
                    },
                  }}
                  onClick={clearFilters}
                >
                  <Typography fontSize={"1rem"}> Clear Filters</Typography>
                </Button>
              )}
            </Box>
            {!isBookedProducts}
          </Box>
          {/* Product Listings */}
          <Box>
            <Grid container spacing={3} mt={2}>
              {Array.isArray(products.products) &&
                products.products.map(
                  ({
                    _id,
                    userId,
                    name,
                    description,
                    price,
                    quantity,
                    minQuantity,
                    reorderPoint,
                    maxQuantity,
                    category,
                    bookings,
                  }) => (
                    <Grid item xs={12} sm={6} key={_id}>
                      <ProductWidget
                        productId={_id}
                        productUserId={userId}
                        name={name}
                        description={description}
                        price={price}
                        quantity={quantity}
                        minQuantity={minQuantity}
                        reorderPoint={reorderPoint}
                        maxQuantity={maxQuantity}
                        category={category}
                        bookings={bookings}
                        defaultStatus={defaultStatus}
                      />
                    </Grid>
                  )
                )}
            </Grid>
            <Box display={"flex"} justifyContent={"center"} mt={4}>
              <CustomPagination
                page={page}
                limit={products.limit ? products.limit : 0}
                total={products.total ? products.total : 0}
                setPage={handlePageChange}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProductsWidget;
