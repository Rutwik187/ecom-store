import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { urlFor } from "../lib/client";

import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function CheckoutModal({
  coupon,
  subTotal,
  info,
  couponDiscount,
}) {
  const [open, setOpen] = useState(false);
  // const [deliveryCharge, setDeliveryCharge] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const cart = useSelector((state) => state.cart.cart);
  const name = useRef();
  const phoneNo = useRef();
  const address = useRef();

  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

  const handlePhoneChange = () => {
    const phoneNumber = phoneNo.current.value;
    if (phoneNumber.length === 10) {
      setPhoneError("");
    }
  };

  const handleAddressChange = () => {
    const userAddress = address.current.value;
    if (userAddress.length >= 25) {
      setAddressError("");
    }
  };

  const mobileNumber = info[0]?.whatsAppNo;

  let deliveryCharge = 0;
  if (subTotal < info[0]?.freeDelivery) {
    // setDeliveryCharge(100);
    deliveryCharge = info[0]?.deliveryCharges;
  }
  console.log(deliveryCharge);

  const handleSendWhatsApp = () => {
    const phoneNumber = phoneNo.current.value;
    const userAddress = address.current.value;

    if (phoneNumber.length !== 10) {
      setPhoneError("Phone number must be 10 digits.");
      return;
    } else {
      setPhoneError("");
    }

    if (userAddress.length < 25) {
      setAddressError("Address must be at least 25 characters.");
      return;
    } else {
      setAddressError("");
    }

    const message = encodeURIComponent(
      "📦 New order 📦\n\n" +
        cart
          .map(
            (product) =>
              `${product.name}: ${product.count} X ₹${
                product.discountedPrice
              } = ₹${product.count * product.discountedPrice}`
          )
          .join("\n") +
        `\n\n Coupon Code: ${coupon} \n Coupon Discount : ₹${couponDiscount} \n Delivery Charges : ₹${deliveryCharge}  \n\n Subtotal: ${
          subTotal + deliveryCharge
        }\n` +
        `\n 🏡 Address: ${address.current.value}\n ☎️  Phone No.: ${phoneNo.current.value} \n 🙎 Name: ${name.current.value}`
    );
    const whatsappURL = `https://api.whatsapp.com/send?phone=91${mobileNumber}&text=${message}`;

    window.open(
      whatsappURL,
      "_blank" // <- This is what makes it open in a new window.
    );
    window.location.href = "/success";
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center"
      >
        Checkout
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="absolute left-1/2 transform -translate-x-1/2 pt-20 w-[400px] h-full rounded-2xl sm:w-[600px] scrollbar-hide"
          sx={{ overflow: "scroll" }}
        >
          <div className="bg-gray-100 rounded-xl px-8">
            <AiOutlineCloseCircle
              className="w-16 h-16 absolute right-0 p-2 cursor-pointer"
              onClick={handleClose}
            />
            <div className="container mx-auto py-8">
              <h1 className="text-2xl font-bold mb-6 text-center">
                Checkout Form
              </h1>
              <div>
                <form className="w-full mx-auto bg-white p-8 rounded-md shadow-md flex flex-col gap-4 sm:gap-8">
                  <div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        for="name"
                      >
                        Name
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Rajesh Verma"
                        ref={name}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Phone Number
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        type="number"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder={mobileNumber}
                        ref={phoneNo}
                        required
                        onChange={handlePhoneChange}
                      />
                      {phoneError && (
                        <p className="text-red-500 text-sm">{phoneError}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        for="password"
                      >
                        Address
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        id="address"
                        name="address"
                        placeholder="address"
                        ref={address}
                        onChange={handleAddressChange}
                        required
                      />
                      {addressError && (
                        <p className="text-red-500 text-sm">{addressError}</p>
                      )}
                    </div>
                  </div>

                  <img
                    src={
                      info[0]
                        ? info[0]?.payQR
                          ? urlFor(info[0]?.payQR).url()
                          : ""
                        : ""
                    }
                    alt="Payment QR"
                    className="object-contain"
                  />
                </form>
                <div className="mb-4 mt-4">
                  <i
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="confirm-password"
                  >
                    Also share whatsApp location and payment screenshot for
                    convenience
                  </i>
                </div>

                <button
                  onClick={handleSendWhatsApp}
                  className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center"
                  type="button"
                >
                  Place order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
