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
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import uuid4 from "uuid4";
import { useMutation } from "convex/react";

function SignInDialog({ openDialog, CloseDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);
  const convex = useConvex();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
      );

      console.log(userInfo);
      const user = userInfo.data;
      let userData;

      try {
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
      } catch (error) {
        console.error("Error handling user:", error);
        // Fallback to Google data if DB operations fail
        userData = user;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      setUserDetail(userData);

      // Close the dialog
      CloseDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
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
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={googleLogin}
            >
              Sign In With Google
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
