'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface DataItem {
  id: string
  vendorName: string
  contactPerson: string
  email: string
  phone: string
  productType: string
  rating: number
  children?: DataItem[]
}

const initialData: DataItem[] = [
  {
    id: '1',
    vendorName: 'GrapeVine Supplies',
    contactPerson: 'John Doe',
    email: 'john@grapevine.com',
    phone: '(555) 123-4567',
    productType: 'Vines',
    rating: 4.5,
    children: [
      { id: '1-1', vendorName: 'GrapeVine Napa', contactPerson: 'Jane Smith', email: 'jane@grapevine.com', phone: '(555) 987-6543', productType: 'Vines', rating: 4.2 },
      { id: '1-2', vendorName: 'GrapeVine Sonoma', contactPerson: 'Bob Johnson', email: 'bob@grapevine.com', phone: '(555) 246-8135', productType: 'Vines', rating: 4.8 },
    ],
  },
  {
    id: '2',
    vendorName: 'WineTech Solutions',
    contactPerson: 'Alice Brown',
    email: 'alice@winetech.com',
    phone: '(555) 369-2580',
    productType: 'Equipment',
    rating: 4.0,
    children: [
      { id: '2-1', vendorName: 'WineTech Filters', contactPerson: 'Charlie Davis', email: 'charlie@winetech.com', phone: '(555) 147-2589', productType: 'Filters', rating: 4.3 },
    ],
  },
  { id: '3', vendorName: 'Barrel Masters', contactPerson: 'Eva Green', email: 'eva@barrelmasters.com', phone: '(555) 951-7532', productType: 'Barrels', rating: 4.7 },
]

const countUnique = (arr: any[]) => new Set(arr).size;

const calculateWeightedAverage = (items: DataItem[]) => {
  const totalWeight = items.reduce((sum, item) => sum + item.rating, 0);
  const weightedSum = items.reduce((sum, item) => sum + item.rating * item.rating, 0);
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

const aggregateChildData = (children: DataItem[] = []) => ({
  contractCount: children.length,
  productTypeCount: countUnique(children.map(child => child.productType)),
  totalRating: children.reduce((sum, child) => sum + child.rating, 0),
  weightedRating: calculateWeightedAverage(children),
});

export default function NestedDataGrid() {
  const [data, setData] = useState<DataItem[]>(initialData)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleEdit = (id: string, field: keyof DataItem, value: string | number) => {
    setData(prevData => {
      const updateItem = (items: DataItem[]): DataItem[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, [field]: value }
          }
          if (item.children) {
            return { ...item, children: updateItem(item.children) }
          }
          return item
        })
      }
      return updateItem(prevData)
    })
  }

  const addChild = (parentId: string) => {
    setData(prevData => {
      return prevData.map(item => {
        if (item.id === parentId) {
          const newChild: DataItem = {
            id: `${parentId}-${item.children ? item.children.length + 1 : 1}`,
            vendorName: 'New Vendor',
            contactPerson: 'New Contact',
            email: '',
            phone: '',
            productType: 'New Product',
            rating: 0
          };
          return {
            ...item,
            children: [...(item.children || []), newChild]
          };
        }
        return item;
      });
    });
  };

  const renderRow = (item: DataItem, depth: number = 0) => {
    const isExpanded = expandedRows.has(item.id);
    const isParent = depth === 0;
    const aggregatedData = isParent ? aggregateChildData(item.children) : null;

    return (
      <React.Fragment key={item.id}>
        <TableRow className="h-8 hover:bg-muted/50 transition-colors">
          <TableCell className="p-0">
            <div className="flex items-center">
              {isParent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleRow(item.id)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              {isParent ? (
                <Input
                  value={item.vendorName}
                  onChange={(e) => handleEdit(item.id, 'vendorName', e.target.value)}
                  className="h-8 border-0 focus-visible:ring-0"
                />
              ) : (
                <div className="px-3 py-2" style={{paddingLeft: `${depth * 20}px`}}></div>
              )}
            </div>
          </TableCell>
          <TableCell className="p-0">
            {isParent ? (
              <div className="px-3 py-2">{aggregatedData!.contractCount} vendor{aggregatedData!.contractCount !== 1 ? 's' : ''}</div>
            ) : (
              <Input
                value={item.contactPerson}
                onChange={(e) => handleEdit(item.id, 'contactPerson', e.target.value)}
                className="h-8 border-0 focus-visible:ring-0"
              />
            )}
          </TableCell>
          <TableCell className="p-0">
            {isParent ? (
              <div className="px-3 py-2">{aggregatedData!.productTypeCount} product type{aggregatedData!.productTypeCount !== 1 ? 's' : ''}</div>
            ) : (
              <Input
                value={item.email}
                onChange={(e) => handleEdit(item.id, 'email', e.target.value)}
                className="h-8 border-0 focus-visible:ring-0"
              />
            )}
          </TableCell>
          <TableCell className="p-0">
            {isParent ? (
              <div className="px-3 py-2">{aggregatedData!.totalRating.toFixed(2)}</div>
            ) : (
              <Input
                value={item.phone}
                onChange={(e) => handleEdit(item.id, 'phone', e.target.value)}
                className="h-8 border-0 focus-visible:ring-0"
              />
            )}
          </TableCell>
          <TableCell className="p-0">
            {isParent ? (
              <div className="px-3 py-2">{aggregatedData!.weightedRating.toFixed(2)}</div>
            ) : (
              <Input
                value={item.productType}
                onChange={(e) => handleEdit(item.id, 'productType', e.target.value)}
                className="h-8 border-0 focus-visible:ring-0"
              />
            )}
          </TableCell>
          <TableCell className="p-0">
            {isParent ? (
              <div className="px-3 py-2">{item.rating.toFixed(2)}</div>
            ) : (
              <Input
                type="number"
                value={item.rating}
                onChange={(e) => handleEdit(item.id, 'rating', parseFloat(e.target.value))}
                className="h-8 border-0 focus-visible:ring-0"
              />
            )}
          </TableCell>
          <TableCell className="p-2 text-right">
            {isParent ? 
              aggregatedData!.totalRating.toFixed(2) : 
              item.rating.toFixed(2)
            }
          </TableCell>
        </TableRow>
        {isExpanded && item.children && item.children.map(child => renderRow(child, depth + 1))}
        {isParent && isExpanded && item.children && (
          <TableRow>
            <TableCell colSpan={7}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addChild(item.id)}
                className="mt-2 ml-4"
              >
                Add Child
              </Button>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold w-1/4">Vendor Name</TableHead>
            <TableHead className="font-semibold w-1/6">Contact Person</TableHead>
            <TableHead className="font-semibold w-1/6">Email</TableHead>
            <TableHead className="font-semibold w-1/6">Phone</TableHead>
            <TableHead className="font-semibold w-1/12">Product Type</TableHead>
            <TableHead className="font-semibold w-1/12">Rating</TableHead>
            <TableHead className="font-semibold text-right w-1/6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => renderRow(item))}
        </TableBody>
      </Table>
    </Card>
  )
}

