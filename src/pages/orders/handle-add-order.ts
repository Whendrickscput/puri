import { useToast } from "@chakra-ui/react";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { NavigateFunction } from "react-router-dom";
import { auth, database } from "../../config/firebase";

async function handleAddOrder(
  data: AddOrderForm,
  navigate: NavigateFunction,
  toast: ReturnType<typeof useToast>
) {
  try {
    const {
      customer,
      qty,
      product,
      additionalInfo,
      payment,
      scheduledTime,
      location,
    } = data;

    const { base, bonus } = qty;

    const order: Order<object> = {
      customer: customer.value, // in uid
      qty: {
        base,
        ...(bonus && { bonus }),
      },
      product,
      additionalInfo,
      ...(payment && { payment }),
      ...(scheduledTime && { scheduledTime }),
      ...(location && { location }),
      createdAt: serverTimestamp(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sales: auth.currentUser!.uid,
    };

    await set(push(ref(database, "orders")), order);

    toast({
      title: "Pesanaan berhasil ditambahkan",
      status: "success",
      duration: 3000,
    });

    navigate("/orders");
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
      });
    }
  }
}

export default handleAddOrder;
