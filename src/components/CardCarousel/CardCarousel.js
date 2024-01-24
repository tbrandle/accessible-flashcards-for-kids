import { useCallback, useEffect, useState } from 'react';
import './CardCarousel.scss';
import useEmblaCarousel from 'embla-carousel-react';
import ClassNames from 'embla-carousel-class-names';
import Card from '../Card/Card';
import { PrevButton, NextButton, usePrevNextButtons } from './CardCarouselButtons';

const integers = Array.from({ length: 11 }, (_, index) => index);

export const equations = integers.flatMap((firstNum) =>
	integers.map((secondNum) => ({
		firstNum,
		secondNum,
		result: firstNum * secondNum,
	})),
);

const shuffle = (arr) => {
	return arr.slice().sort(() => Math.random() - 0.5);
};

const cards = shuffle(equations);

export const CardCarousel = ({ icon }) => {
	const emblaOptions = {
		duration: 12,
	};
	const classNamesOptions = { selected: 'my-selected-class' };

	const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, [ClassNames(classNamesOptions)]);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [selectedId, setSelectedId] = useState(null);

	const onScroll = useCallback((emblaApi) => {
		const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
		setScrollProgress(progress * 100);
	}, []);

	const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

	useEffect(() => {
		if (!emblaApi) return;

		onScroll(emblaApi);
		emblaApi.on('reInit', onScroll);
		emblaApi.on('scroll', onScroll);
	}, [emblaApi, onScroll]);

	const handleCardClick = (id) => {
		setSelectedId(id !== selectedId ? id : null);
	};

	// // TODO: remove this console log
	// useEffect(() => {
	//   if (emblaApi) {
	//     console.log(emblaApi.slideNodes()); // Access API
	//   }
	// }, [emblaApi]);

	// Todo: figure out how to round the number or set it so it doesn't wobble back and forth
	// or +10, +20 +30... fades in and up... like scoring points
	const progressText = (progress) => {
		if (progress <= 10) {
			return '';
		} else if (progress <= 20) {
			return 'First 10 Down!';
		} else if (progress <= 30) {
			return 'Keep Going!';
		} else if (progress <= 50) {
			return '1/2 way there';
		}
	};

	return (
		<section className='embla'>
			<div className='viewport' ref={emblaRef}>
				<ul className='slidesContainer' role='listbox'>
					{cards.length > 0 &&
						cards.map(({ firstNum, secondNum, result }, i) => {
							const isSelected = i === selectedId;

							return (
								<li className='slide' role='option' key={i}>
									<article>
										<Card
											icon={icon}
											isSelected={isSelected}
											firstNum={firstNum}
											secondNum={secondNum}
											solution={result}
											onClick={() => handleCardClick(i)}
										/>
									</article>
								</li>
							);
						})}
				</ul>
			</div>
			<div className='progressContainer'>
				<div
					className='progressBar'
					// data-progress-text={progressText(scrollProgress)}
					style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
				/>
			</div>
			<div className='buttonContainer'>
				<PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
				<NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
			</div>
		</section>
	);
};
export default CardCarousel;
