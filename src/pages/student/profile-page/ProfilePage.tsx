import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProfileStore } from "./profileStore";
import { useDialogStore } from "@/stores/commonDialogStore";

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
    updateFormData,
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
    if (!profile.phoneNumber.trim()) {
      showCommonDialog({
        title: "驗證錯誤",
        description: "電話號碼 不可為空白。",
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
      updateProfile(data);
      showCommonDialog({
        title: "儲存成功",
        description: "個人資料已更新。",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile", error);
      showCommonDialog({
        title: "儲存失敗",
        description: "無法儲存個人資料，請稍後再試。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <h1 className="text-start text-3xl mb-10 font-bold">個人資料</h1>
      <Card className="w-full min-w-[600px] max-w-[1280px] border-none">
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
              onChange={(e) => updateFormData({ email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              姓名<span className="text-red-300 ms-1">*</span>{" "}
            </Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              disabled={!isEditing}
              onChange={(e) => updateFormData({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">電話號碼</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={profile.phoneNumber}
              disabled={!isEditing}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 w-full">
            {!isEditing ? (
              <Button className="w-full" onClick={() => setIsEditing(true)}>
                編輯
              </Button>
            ) : (
              <>
                <Button
                  className="w-full text-white"
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
    // </div>
  );
}
