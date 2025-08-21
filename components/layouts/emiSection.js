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
  // State for dynamic loan and truck details
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [truckModel, setTruckModel] = useState("");
  const [truckNumberPlate, setTruckNumberPlate] = useState("");
  const [truckPurchaseDate, setTruckPurchaseDate] = useState("");
  const [truckDriverName, setTruckDriverName] = useState("");
  const [truckColor, setTruckColor] = useState("");
  const [truckSizeType, setTruckSizeType] = useState("");
  const [truckType, setTruckType] = useState("");
  const [loans, setLoans] = useState([]);
  const [emiDetails, setEmiDetails] = useState(null);

  // Function to handle adding a new loan with truck details
  const addLoan = () => {
    const newLoan = {
      srNo: loans.length + 1, // Incremental serial number
      loanAmount,
      interestRate,
      loanTenure,
      emiDetails,
      dueDate: moment().add(1, "months").format("YYYY-MM-DD"),
      truckDetails: {
        truckModel,
        truckNumberPlate,
        truckPurchaseDate,
        truckDriverName,
        truckColor,
        truckSizeType,
        truckType,
      },
    };
    setLoans([...loans, newLoan]);

    // Clear form after submission
    setLoanAmount("");
    setInterestRate("");
    setLoanTenure("");
    setTruckModel("");
    setTruckNumberPlate("");
    setTruckPurchaseDate("");
    setTruckDriverName("");
    setTruckColor("");
    setTruckSizeType("");
    setTruckType("");
    setEmiDetails(null);
  };

  // Function to handle EMI calculation when input changes
  useEffect(() => {
    if (loanAmount && interestRate && loanTenure) {
      const details = calculateEmi(loanAmount, interestRate, loanTenure);
      setEmiDetails(details);
    }
  }, [loanAmount, interestRate, loanTenure]);

  return (
    <div
      className="emi-section"
      style={{ padding: "20px" }}
    >
      <CardContent>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{ mb: 4 }}
        >
          Truck Loan EMI Notifier Dashboard
        </Typography>

        {/* Add New Loan Form */}
        <Typography
          variant="h6"
          gutterBottom
        >
          Add New EMI with Truck Details
        </Typography>

        <Grid
          container
          spacing={2}
        >
          {/* Loan Amount */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <TextField
              label="Loan Amount"
              fullWidth
              variant="outlined"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
            />
          </Grid>

          {/* Interest Rate */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <TextField
              label="Annual Interest Rate (%)"
              fullWidth
              variant="outlined"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter interest rate"
            />
          </Grid>

          {/* Loan Tenure */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <TextField
              label="Loan Tenure (months)"
              fullWidth
              variant="outlined"
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              placeholder="Enter tenure in months"
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ mt: 2 }}
        >
          {/* EMI Calculation Result */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            {emiDetails && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  Calculated EMI:
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">EMI Amount:</Typography>
                  <Typography variant="body2">₹ {emiDetails.emi}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Total Payment:</Typography>
                  <Typography variant="body2">
                    ₹ {emiDetails.totalPayment}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Total Interest:</Typography>
                  <Typography variant="body2">
                    ₹ {emiDetails.totalInterest}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Truck Purchase Date */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <TextField
            label="Truck Purchase Date"
            fullWidth
            variant="outlined"
            type="date"
            value={truckPurchaseDate}
            onChange={(e) => setTruckPurchaseDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Truck Driver Name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <TextField
            label="Truck Driver Name"
            fullWidth
            variant="outlined"
            value={truckDriverName}
            onChange={(e) => setTruckDriverName(e.target.value)}
            placeholder="Enter truck driver's name"
          />
        </Grid>

        {/* Truck Color */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <TextField
            label="Truck Color"
            fullWidth
            variant="outlined"
            value={truckColor}
            onChange={(e) => setTruckColor(e.target.value)}
            placeholder="Enter truck color"
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
      >
        {/* Truck Size Type */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormControl fullWidth>
            <InputLabel>Truck Size</InputLabel>
            <Select
              value={truckSizeType}
              onChange={(e) => setTruckSizeType(e.target.value)}
              label="Truck Size"
            >
              <MenuItem value="20ft">20 Foot</MenuItem>
              <MenuItem value="40ft">40 Foot</MenuItem>
              <MenuItem value="80ft">80 Foot</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Truck Type (Container or Coil) */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormControl fullWidth>
            <InputLabel>Truck Type</InputLabel>
            <Select
              value={truckType}
              onChange={(e) => setTruckType(e.target.value)}
              label="Truck Type"
            >
              <MenuItem value="Container">Container</MenuItem>
              <MenuItem value="Coil">Coil</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={addLoan}
          disabled={!emiDetails}
        >
          Add Loan
        </Button>
      </Box>
    </CardContent>

      {/* Loan List Table */ }
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6">Loan List</Typography>
    {loans.length === 0 ? (
      <Typography variant="body2">No loans added yet.</Typography>
    ) : (
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="loan table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>EMI</TableCell>
              <TableCell>Total Payment</TableCell>
              <TableCell>Total Interest</TableCell>
              <TableCell>Truck Model</TableCell>
              <TableCell>Truck Type</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => {
              const dueDate = moment(loan.dueDate);
              const daysRemaining = dueDate.diff(moment(), "days");
              const dueIn =
                daysRemaining <= 0
                  ? "Due Today"
                  : `${daysRemaining} Days Left`;

              return (
                <TableRow key={loan.srNo}>
                  <TableCell>{loan.srNo}</TableCell>
                  <TableCell>₹ {loan.loanAmount}</TableCell>
                  <TableCell>₹ {loan.emiDetails.emi}</TableCell>
                  <TableCell>₹ {loan.emiDetails.totalPayment}</TableCell>
                  <TableCell>₹ {loan.emiDetails.totalInterest}</TableCell>
                  <TableCell>{loan.truckDetails.truckModel}</TableCell>
                  <TableCell>{loan.truckDetails.truckType}</TableCell>
                  <TableCell>
                    {dueDate.format("YYYY-MM-DD")} - {dueIn}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
    </div >
  );
}
