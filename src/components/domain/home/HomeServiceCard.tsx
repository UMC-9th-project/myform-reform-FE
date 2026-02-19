interface HomeServiceCardProps {
  title: string;
  description1: string;
  description2: string;
  image: string;
  imageAlt: string;
  imageStyle?: {
    left?: string;
    top?: string;
    width?: string;
    height?: string;
  };
}

const HomeServiceCard = ({
  title,
  description1,
  description2,
  image,
  imageAlt,
  imageStyle = {
    left: '6.3125rem',
    top: '10.3125rem',
    width: '8.625rem',
    height: '8.1875rem',
  },
}: HomeServiceCardProps) => {
  return (
    <div className="bg-white h-[19.8125rem] w-[16.4375rem] rounded-[1.25rem] shadow-[0px_1px_20.5px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
      <div className="absolute left-5 top-6 flex flex-col gap-[0.5625rem] w-[13.9375rem]">
        <h3 className="heading-h5-sb text-[var(--color-black)]">
          {title}
        </h3>
        <div className="body-b3-rg text-[var(--color-gray-50)]">
          <p className="mb-0">{description1}</p>
          <p>{description2}</p>
        </div>
      </div>
      <div
        className="absolute"
        style={{
          left: imageStyle.left,
          top: imageStyle.top,
          width: imageStyle.width,
          height: imageStyle.height,
        }}
      >
        <img src={image} alt={imageAlt} className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default HomeServiceCard;
