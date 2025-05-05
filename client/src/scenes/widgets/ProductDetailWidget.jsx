import { Box, Typography } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import UserImage from "../../components/UserImage";
import { useMediaQuery } from "@mui/material";
import { setProduct } from "../../state";
import BookedUserWidget from "./BookedUserWidget";

const ProductDetailWidget = ({
  productId,
  productUserId,
  name,
  description,
  price,
  quantity,
  minQuantity,
  reorderPoint,
  maxQuantity,
  status,
  category,
  bookings,
}) => {
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const role = useSelector((state) => state.user.role);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isBooked = Boolean(bookings[loggedInUserId]);
  const bookingCount = Object.keys(bookings).length;
  const userIds = Object.keys(bookings);

  // Function to handle payment button click
  const payProduct = () => {
    navigate(`/pay`);
  };

  const patchProduct = async () => {
    const response = await fetch(
      `http://localhost:6001/products/${productId}/booking`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    if (response.status === 400) {
      // Backend returned a "No available seats" message
      const data = await response.json();
      alert(data.message);
      return;
    }
    const updatedProduct = await response.json();
    dispatch(setProduct({ product: updatedProduct }));
  };

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      flexDirection={isNonMobileScreens ? "row" : "column"}
      gap="2rem"
      padding="1rem"
    >
      <WidgetWrapper
        width={isNonMobileScreens ? "800px" : "100%"}
        p="2rem"
        backgroundColor="#1a1a1a"
        borderRadius="1.5rem"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb="2rem"
        >
          <Typography
            fontSize={isNonMobileScreens ? "3rem" : "2rem"}
            color={role === "employee" ? "primary" : "#834bff"}
            fontWeight="bold"
            textAlign="center"
          >
            Product Details
          </Typography>
        </Box>

        <Box mt="1rem">
          <Box
            style={{
              borderRadius: "2rem",
              padding: "1rem",
              backgroundColor: "#2a2a2a",
              marginBottom: "1rem",
            }}
            display="flex"
            alignItems="center"
          >
            <Typography
              color="white"
              variant="subtitle1"
              width="180px"
              fontWeight="500"
            >
              Product Name:
            </Typography>
            <Typography
              color="white"
              variant="h6"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="bold"
            >
              {name}
            </Typography>
          </Box>

          <Box
            style={{
              borderRadius: "2rem",
              padding: "1rem",
              backgroundColor: "#2a2a2a",
              marginBottom: "1rem",
            }}
            display="flex"
            alignItems="center"
          >
            <Typography
              color="white"
              variant="subtitle1"
              width="180px"
              fontWeight="500"
            >
              Description:
            </Typography>
            <Typography
              color="white"
              variant="h6"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="bold"
            >
              {description}
            </Typography>
          </Box>

          <Box
            style={{
              borderRadius: "2rem",
              padding: "1rem",
              backgroundColor: "#2a2a2a",
              marginBottom: "1rem",
            }}
            display="flex"
            alignItems="center"
          >
            <Typography
              color="white"
              variant="subtitle1"
              width="180px"
              fontWeight="500"
            >
              Price:
            </Typography>
            <Typography
              color="white"
              variant="h6"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="bold"
            >
              {price}
            </Typography>
          </Box>

          <Box
            style={{
              borderRadius: "2rem",
              padding: "1rem",
              backgroundColor: "#2a2a2a",
              marginBottom: "1rem",
            }}
            display="flex"
            alignItems="center"
          >
            <Typography
              color="white"
              variant="subtitle1"
              width="180px"
              fontWeight="500"
            >
              Quantity:
            </Typography>
            <Typography
              color="white"
              variant="h6"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="bold"
            >
              {quantity}
            </Typography>
          </Box>

          {minQuantity != null && (
            <>
              <Box
                style={{
                  borderRadius: "2rem",
                  padding: "1rem",
                  backgroundColor: "#2a2a2a",
                  marginBottom: "1rem",
                }}
                display="flex"
                alignItems="center"
              >
                <Typography
                  color="white"
                  variant="subtitle1"
                  width="180px"
                  fontWeight="500"
                >
                  Minimum Quantity:
                </Typography>
                <Typography
                  color="white"
                  variant="h6"
                  fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
                  fontWeight="bold"
                >
                  {minQuantity}
                </Typography>
              </Box>

              <Box
                style={{
                  borderRadius: "2rem",
                  padding: "1rem",
                  backgroundColor: "#2a2a2a",
                  marginBottom: "1rem",
                }}
                display="flex"
                alignItems="center"
              >
                <Typography
                  color="white"
                  variant="subtitle1"
                  width="180px"
                  fontWeight="500"
                >
                  Reorder Point:
                </Typography>
                <Typography
                  color="white"
                  variant="h6"
                  fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
                  fontWeight="bold"
                >
                  {reorderPoint}
                </Typography>
              </Box>

              <Box
                style={{
                  borderRadius: "2rem",
                  padding: "1rem",
                  backgroundColor: "#2a2a2a",
                  marginBottom: "1rem",
                }}
                display="flex"
                alignItems="center"
              >
                <Typography
                  color="white"
                  variant="subtitle1"
                  width="180px"
                  fontWeight="500"
                >
                  Maximum Quantity:
                </Typography>
                <Typography
                  color="white"
                  variant="h6"
                  fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
                  fontWeight="bold"
                >
                  {maxQuantity}
                </Typography>
              </Box>
            </>
          )}

          <Box
            style={{
              borderRadius: "2rem",
              padding: "1rem",
              backgroundColor: "#2a2a2a",
              marginBottom: "1rem",
            }}
            display="flex"
            alignItems="center"
          >
            <Typography
              color="white"
              variant="subtitle1"
              width="180px"
              fontWeight="500"
            >
              Category:
            </Typography>
            <Typography
              color="white"
              variant="h6"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="bold"
            >
              {category}
            </Typography>
          </Box>
        </Box>

        {role === "employee" && status === "Marketplace" && (
          <Box display="flex" justifyContent="center" gap="1rem" mt="2rem">
            <Button
              onClick={patchProduct}
              variant={isBooked ? "contained" : "outlined"}
              color={isBooked ? "error" : "primary"}
              sx={{
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "1.5rem",
              }}
            >
              {isBooked ? "Cancel Product" : "Order Product"}
            </Button>
            <Button
              onClick={payProduct}
              variant="contained"
              color="success"
              sx={{
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "1.5rem",
              }}
            >
              Pay
            </Button>
          </Box>
        )}

        {role === "supplier" && status === "Marketplace" && (
          <Box
            style={{
              borderRadius: "2rem",
              padding: "1rem",
              backgroundColor: "#2a2a2a",
              marginTop: "1.5rem",
            }}
          >
            <Typography color="white" variant="subtitle1" ml="0.3rem">
              Orders for this Product:
            </Typography>
            <Typography
              ml="0.5rem"
              color="white"
              variant="h6"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="bold"
            >
              {bookingCount}
            </Typography>
          </Box>
        )}
      </WidgetWrapper>

      {role === "supplier" && userIds.length > 0 && (
        <Box width={isNonMobileScreens ? "400px" : "100%"}>
          <Typography
            textAlign="center"
            fontSize={isNonMobileScreens ? "2rem" : "1.5rem"}
            color={"#834bff"}
            fontWeight="bold"
            mb="1rem"
          >
            Ordered this Product
          </Typography>
          <Box display="flex" flexDirection="column" gap="1rem">
            {userIds.map((userId) => (
              <BookedUserWidget key={userId} userId={userId} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailWidget;
