import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Lookup from "../../app/data/Lookup";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import uuid4 from "uuid4";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";

function SignInDialog({ openDialog, CloseDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);
  const convex = useConvex();
  const [isLoading, setIsLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: "Bearer " + tokenResponse?.access_token },
          }
        );

        const user = userInfo.data;
        let userData;

        // Check if user already exists
        const existingUser = await convex.query(api.users.getUser, {
          email: user.email,
        });
        if (existingUser) {
          userData = existingUser;
        } else {
          // Create new user
          await CreateUser({
            name: user?.name,
            email: user?.email,
            picture: user?.picture,
            uid: uuid4(),
          });
          // Fetch the newly created user
          userData = await convex.query(api.users.getUser, {
            email: user.email,
          });
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setUserDetail(userData);

        // Close the dialog
        CloseDialog(false);
      } catch (error) {
        console.error("Error during sign in:", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      setIsLoading(false);
    },
  });
  return (
    <div>
      <Dialog open={openDialog} onOpenChange={CloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-extrabold text-2xl text-center">
              LucidAI
            </DialogTitle>
            <DialogDescription>{Lookup.SIGNIN_SUBHEADING}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-3 mt-4">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={googleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In With Google"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {Lookup?.SIGNIN_AGREEMENT_TEXT}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SignInDialog;
