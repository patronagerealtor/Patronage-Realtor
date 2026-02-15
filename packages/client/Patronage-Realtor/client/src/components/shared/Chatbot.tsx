import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Chatbot() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="lg" 
            className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center"
            data-testid="button-chatbot"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="sr-only">Chat with us</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-6 mb-2 p-0 rounded-lg border-2 border-border shadow-xl">
          <div className="bg-muted p-4 border-b border-border rounded-t-lg">
            <h4 className="font-heading font-semibold">Chat with us</h4>
            <p className="text-xs text-muted-foreground">We're online to help you.</p>
          </div>
          <div className="p-4 h-64 flex items-center justify-center bg-background">
            <p className="text-sm text-muted-foreground text-center">Chat interface placeholder</p>
          </div>
          <div className="p-4 border-t border-border bg-background rounded-b-lg">
             <div className="h-10 bg-secondary rounded border border-input w-full" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
