"use client";

import { fontNunito, fontRubik, fontSans  } from "@/lib/fonts"
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";


export default function Logo() {

  return (
    <Link href="/">
      <div className="text-3xl font-bold">
        <span className="text-first-color">rc</span>
        <span className="text-black">tracker</span>
        <span className="text-gray-300">.dev</span>
      </div>
    </Link>
  )
}
