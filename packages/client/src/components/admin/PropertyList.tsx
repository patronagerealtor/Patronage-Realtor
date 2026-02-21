import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Property } from "../../lib/propertyStore";
import { formatIndianPrice } from "../../lib/formatIndianPrice";

export type PropertyListProps = {
  properties: Property[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
};

export function PropertyList({
  properties,
  onEdit,
  onDelete,
  onPreview,
}: PropertyListProps) {
  return (
    <Card className="lg:col-span-7 p-6 h-fit">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Properties</h2>
        <Badge variant="secondary">{properties.length}</Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-3">Title</TableHead>
            <TableHead className="py-3">Status</TableHead>
            <TableHead className="py-3">Price</TableHead>
            <TableHead className="text-right py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((p) => (
            <TableRow key={p.id} className="hover:bg-muted/50">
              <TableCell className="py-3">
                <div className="space-y-0.5">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.location}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3">{p.status}</TableCell>
              <TableCell className="py-3">
                {formatIndianPrice(p.price_value ?? p.price)}
              </TableCell>
              <TableCell className="text-right py-3">
                <div className="inline-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(p.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPreview(p.id)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(p.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
