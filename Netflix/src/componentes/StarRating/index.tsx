'use client';
import { FaStar } from "react-icons/fa";
import {FaRegStar} from "react-icons/fa";

import './index.scss';

export interface Props {
  rating: number;
}

export default function StarRating(props: Props) {
  const numStars = Math.round(props.rating / 2);
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < numStars) {
      stars.push(
        <FaStar key={i} className="star filled" />
      );
    } else {
      stars.push(
        <FaRegStar key={i} className="star empty" />
      );
    }
  }

  return (
    <div className="star-rating">
      {stars}
      <span className="rating-text">({props.rating.toFixed(1)})</span>
    </div>
  );
}