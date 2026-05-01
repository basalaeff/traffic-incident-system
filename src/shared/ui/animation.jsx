import styled, { keyframes } from 'styled-components';
import { fadeInUp, fadeInRight, fadeInLeft } from 'react-animations';
// ============================================================================
// АНИМАЦИЯ СНИЗУ ВВЕРХ
// ============================================================================
const fadeInUpKey = keyframes`${fadeInUp}`;
export const AnimationFadeInUp = styled.div`
  animation: 0.5s ${fadeInUpKey} ease-out forwards;
`;
// ============================================================================
// АНИМАЦИЯ СПРАВА НА ЛЕВО
// ============================================================================
const fadeInRightKey = keyframes`${fadeInRight}`;
export const AnimationFadeInRight = styled.div`
  animation: 0.5s ${fadeInRightKey} ease-out forwards;
`;
// ============================================================================
// АНИМАЦИЯ СЛЕВА НА ПРАВО
// ============================================================================
const fadeInLeftKey = keyframes`${fadeInLeft}`;
export const AnimationFadeInLeft = styled.div`
  animation: 0.5s ${fadeInLeftKey} ease-out forwards;
`;
