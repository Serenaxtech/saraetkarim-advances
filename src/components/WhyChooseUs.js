import Image from 'next/image';

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="why-title mb-4">Why Choose Us?</h2>
            <p className="why-description">
              FIRST AND FORMOST WE BAKE FRESH CAKES! WE MAKE EVERYTHING FROM SCRATCH 
              USING PREMIUM AND SIMPLE INGREDIENTS WITH NO ARTIFICIAL FLAVOURS OR 
              INDUSTRIAL ADDITIVES.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <Image
              src="/images/cake-image.png"
              alt="Beautiful Cake with Flowers"
              className="why-cake-image img-fluid"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
}