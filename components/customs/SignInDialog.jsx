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

function SignInDialog({ openDialog, CloseDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
      );

      console.log(userInfo);
      setUserDetail(userInfo?.data);
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
