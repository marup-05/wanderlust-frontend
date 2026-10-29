"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const DeleteDestinationDialog = ({id}: {id: string}) => {

  

  const handleDeleteDestination = async() => {
    const token = await getTokenFromClient()
    const  res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations/${id}`,{
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`
      }
    }) 
    await res.json()
    redirect('/destinations')
  }
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger render={ <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive">
                <Trash2 className="size-3.5" />
                Delete 
              </Button>}>
          Show Dialog
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDestination}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteDestinationDialog;
