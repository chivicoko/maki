'use client';

import { Card, CardContent } from '../ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const SeverityTable = () => {
  return (
    <Card className="flex-1/3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] relative">
        <CardContent className="p-3">
            {/* TITLE */}
            <h4 className="text-[14px] md:text-[16px] font-semibold mb-1">Severity Table</h4>

            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        <TableHead className="w-[100px] font-bold">Invoice</TableHead>
                        <TableHead className='font-bold'>Status</TableHead>
                        <TableHead className='font-bold'>Method</TableHead>
                        <TableHead className="text-right font-bold">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.slice(0, 6).map((invoice) => (
                    <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                <TableFooter className='bg-muted'>
                    <TableRow>
                        <TableCell colSpan={3} className='font-bold'>Total</TableCell>
                        <TableCell className="text-right font-bold">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </CardContent>
    </Card>
  );
};

export default SeverityTable;

