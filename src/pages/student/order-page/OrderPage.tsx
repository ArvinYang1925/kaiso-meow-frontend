import { Card } from "@/components/ui/card";

const OrderPage = () => {
  return (
    <div className="mt-16 bg-slate-200 py-12">
      <div className="container flex gap-12">
        <div className="order-section rounded-md bg-white basis-2/3">
          <p>表單1</p>
          <p>表單1</p>
          <p>表單1</p>
          <p>表單1</p>
          <p>表單1</p>
          <p>表單1</p>
        </div>
        <div className="order-card-section basis-1/3">
        <Card>
            contentcontentcontentcontent
        </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
