import React, { useEffect, useState } from "react";
import PaymentMethod from "../component/Payment/PaymentMethod";
import ShippingAddress from "../component/Payment/ShippingAddress";
import { Grid, GridItem, Box, Center, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/Navbar/Navbar";

const Payment = () => {
  const navigate = useNavigate;
  const toast = useToast();
  const [address, setAddress] = useState({});
  const [cartData, setCartData] = useState([]);
  let token = JSON.parse(sessionStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`https://good-rose-kingfisher-tam.cyclic.app/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((res) => {
        setCartData(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSaveAddress = (name, street, city, pin) => {
    setAddress({
      address: street,
      city: city,
      pincode: pin,
    });
    toast({
      status: "success",
      title: "Data Saved",
      isClosable: true,
      duration: 3000,
    });
  };

  const handlePay = () => {
    axios
      .post(
        `https://good-rose-kingfisher-tam.cyclic.app/order/add`,
        {
          address: address.address,
          city: address.city,
          pincode: address.pincode,
          product: cartData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data == "data is added") {
          // remove all data from cart after payment

          axios
            .delete(
              `https://good-rose-kingfisher-tam.cyclic.app/cart/removeAll`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            )
            .then((res) => {
              console.log(res.data);
            });
          toast({
            status: "success",
            title: "Order Placed",
            description: "Payment Successfull",
            isClosable: true,
            duration: 3000,
          });
        } else {
          toast({
            status: "error",
            title: "Something Went Wrong!",
            isClosable: true,
            duration: 3000,
          });
        }
      });
  };

  return (
    <>
      <Navbar />
      <Box m="auto" p="8" style={{ width: "100%" }}>
        <Grid
          gridTemplateColumns={{
            base: "repeat(1,1fr)",
            md: "repeat(1rs,1fr)",
            xl: "repeat(2,1fr)",
          }}
          gap={10}
        >
          {/* address section */}
          <GridItem>
            <ShippingAddress handleSaveAddress={handleSaveAddress} />
          </GridItem>
          {/* payment information  */}
          <GridItem>
            <PaymentMethod handlePay={handlePay} />
          </GridItem>
        </Grid>
      </Box>{" "}
    </>
  );
};

export default Payment;
