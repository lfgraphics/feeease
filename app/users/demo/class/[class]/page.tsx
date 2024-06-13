"use client";

import { useEffect, useState } from "react";

const page = ({ params }: { params: { class: string } }) => {
  const [classProp, setClassProp] = useState(params.class);
  
  return (
    <div>
      This page will return class data from the URL dinamically.
      <br />
      Dynamic Prop: {classProp}
    </div>
  );
};

export default page;
