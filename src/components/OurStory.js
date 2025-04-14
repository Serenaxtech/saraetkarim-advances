import Image from 'next/image';

export default function OurStory() {
  return (
    <section className="our-story-section">
      <div className="story-card">
        <div className="image-frame">
          <Image
            src="/images/profile.jpg"
            alt="Coffee Beans"
            className="circle-image"
            width={200}
            height={200}
          />
          <Image
            src="/images/coffee-bean-icon.png"
            alt="Coffee Bean"
            className="bean bean-top-left"
            width={25}
            height={25}
          />
          <Image
            src="/images/coffee-bean-icon.png"
            alt="Coffee Bean"
            className="bean bean-top-right"
            width={25}
            height={25}
          />
          <Image
            src="/images/coffee-bean-icon.png"
            alt="Coffee Bean"
            className="bean bean-bottom-left"
            width={25}
            height={25}
          />
          <Image
            src="/images/coffee-bean-icon.png"
            alt="Coffee Bean"
            className="bean bean-bottom-right"
            width={25}
            height={25}
          />
        </div>
        <div className="story-text">
          <h2 className="section-title">Our Story</h2>
          <p>
          JUST A REGULAR COUPLE WHO STARTED A BUSINESS TOGETHER?
          HE BRINGS THE DOUGH, AND SHE ADDS THE ICING ON THE CAKE!
          </p>
        </div>
      </div>
    </section>
  );
}