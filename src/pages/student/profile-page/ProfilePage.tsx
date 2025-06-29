import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProfileStore } from "./profileStore";
import { useDialogStore } from "@/stores/commonDialogStore";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import axios from "axios";

export type FormData = {
  email: string;
  name: string;
  phoneNumber: string;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const {
    profile,
    isLoading,
    setIsLoading,
    fetchProfile,
    updateProfile,
    updateProfileFormData,
  } = useProfileStore();

  const { showCommonDialog } = useDialogStore();

  /** 初始載入資料 */
  useEffect(() => {
    fetchProfile();
  }, []);

  const validateProfile = () => {
    if (!profile.email.trim()) {
      showCommonDialog({
        title: "驗證錯誤",
        description: "Email 不可為空白。",
      });
      return false;
    }
    if (!profile.name.trim()) {
      showCommonDialog({
        title: "驗證錯誤",
        description: "姓名 不可為空白。",
      });
      return false;
    }
    if (profile.phoneNumber.trim() !== "" && profile.phoneNumber.length < 10) {
      showCommonDialog({
        title: "驗證錯誤",
        description: "電話號碼需為 10 位數字。",
      });
      return false;
    }
    return true;
  };

  const handleUpdateFormData = async () => {
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      const data = {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
      };
      const response = await updateProfile(data);
      showCommonDialog({
        title: "儲存成功",
        description: response.status,
      });
      setIsEditing(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { status, message } = error.response.data;
        showCommonDialog({
          title: status,
          description: message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full md:w-[1200px] mx-auto px-8 mb-16">
        <h1 className="text-start text-3xl mt-16 font-bold mb-8">個人資料</h1>
        <Card className="w-full p-6 border-none">
          <CardHeader></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-left" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={profile.email}
                disabled={true}
                onChange={(e) =>
                  updateProfileFormData({ email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                姓名<span className="text-red-300 ms-1">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                disabled={!isEditing}
                onChange={(e) =>
                  updateProfileFormData({ name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">聯絡電話</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={profile.phoneNumber}
                disabled={!isEditing}
                onChange={(e) =>
                  updateProfileFormData({ phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="mb-2" htmlFor="modifyPwd">
                密碼變更
              </Label>
              <ChangePasswordDialog />
            </div>

            <div className="flex justify-end space-x-2 pt-4 w-full">
              {!isEditing ? (
                <Button className="w-full" onClick={() => setIsEditing(true)}>
                  編輯
                </Button>
              ) : (
                <>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleUpdateFormData}
                    disabled={isLoading}
                  >
                    {isLoading ? "儲存中..." : "儲存"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
