"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="fixed inset-0 bg-gray-200 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md">
        <Card
          className="w-full max-w-md shadow-lg overflow-hidden"
          style={{ height: "600px" }}
        >
          <div className="bg-white border-b">
            <Tabs value={tab} onValueChange={setTab} className="w-full mb-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger
                  value="login"
                  className={`relative px-4 py-2 pt-4 text-sm font-medium ${
                    tab === "login" 
                    ? "bg-white shadow before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-orange-600" 
                    : "hover:bg-gray-200"
                  }`}
                >
                  登入
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className={`relative px-4 py-2 pt-4 text-sm font-medium ${
                    tab === "register" 
                    ? "bg-white shadow before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-orange-600" 
                    : "hover:bg-gray-200"
                  }`}
                >
                  註冊
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CardContent className="p-6 bg-white">
            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
