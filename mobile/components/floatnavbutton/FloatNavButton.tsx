import { ArrowLeftIcon } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FloatNavButtonProps {
  onBack: () => void;
}

export default function FloatNavButton({ onBack }: FloatNavButtonProps) {
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      testID="float-nav-button"
    >
      <ArrowLeftIcon color="white" size={32} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
});
