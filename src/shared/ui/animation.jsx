import styled, { keyframes } from 'styled-components';
import { fadeInUp } from 'react-animations';
// ============================================================================
// АНИМАЦИЯ СНИЗУ ВВЕРХ
// ============================================================================
const fadeInUpKey = keyframes`${fadeInUp}`;
export const AnimationFadeInUp = styled.div`
  animation: 0.5s ${fadeInUpKey} ease-out forwards;
`;
