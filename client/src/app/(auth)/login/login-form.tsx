"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import envConfig from "@/config";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { stat } from "fs";
import React from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { toast } = useToast();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    const result = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          throw data;
        }
        toast({
          title: "Success!",
          description: "Login success!",
          variant: "default",
        });
        return data;
      })
      .catch((e: any) => {
        const errors = e.payload.errors as {
          field: string;
          message: string;
        }[];
        const status = e.status as number;
        if (status === 422) {
          errors.forEach((error) => {
            form.setError(error.field as "email" | "password", {
              type: "server",
              message: error.message,
            });
          });
        } else {
          toast({
            title: "Error",
            description: e.payload.message,
            variant: "destructive",
          });
        }
      });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log(error);
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email: </FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password: </FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
