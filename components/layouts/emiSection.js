import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Function to calculate EMI
const calculateEmi = (loanAmount, interestRate, loanTenure) => {
  const principal = parseFloat(loanAmount);
  const rate = parseFloat(interestRate) / 100 / 12; // Monthly rate
  const tenure = parseInt(loanTenure);

  if (principal && rate && tenure) {
    const emiValue =
      (principal * rate * Math.pow(1 + rate, tenure)) /
      (Math.pow(1 + rate, tenure) - 1);

    const totalAmount = emiValue * tenure;
    const interestPaid = totalAmount - principal;

    return {
      emi: emiValue.toFixed(2),
      totalPayment: totalAmount.toFixed(2),
      totalInterest: interestPaid.toFixed(2),
    };
  }

  return {
    emi: 0,
    totalPayment: 0,
    totalInterest: 0,
  };
};

export default function EmiSection() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">EMI and Truck Details</h1>
    </>
  );
}
