import { useThemeColors } from '@/hooks/use-theme-color';
import { EyeIcon, EyeOffIcon, GlobeIcon, LockIcon, UserIcon } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { QrCodeDTO } from 'shared-password-manager/models';

interface TicketProps {
  data: QrCodeDTO;
}

export function TicketView({ data }: TicketProps) {
  const colors = useThemeColors();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.ticket, { backgroundColor: colors.surface }]}>
      <View style={styles.ticketTop}>
        <Text style={[styles.title, { color: colors.primary }]}>{data.service}</Text>
        {data.website && (
          <View style={styles.infoRow}>
            <GlobeIcon size={18} color={colors.textMuted} />
            <Text style={[styles.infoText, { color: colors.onSurface }]}>{data.website}</Text>
          </View>
        )}
      </View>

      <View style={styles.ticketDivider}>
        <View style={[styles.cutout, styles.cutoutLeft, { backgroundColor: colors.background }]} />
        <View style={styles.dashedLine} />
        <View style={[styles.cutout, styles.cutoutRight, { backgroundColor: colors.background }]} />
      </View>

      <View style={styles.ticketBottom}>
        <View style={styles.credentialGroup}>
          <View style={styles.infoRow}>
            <UserIcon size={18} color={colors.textMuted} />
            <Text style={[styles.label, { color: colors.textMuted }]}>Username</Text>
          </View>
          <Text style={[styles.value, { color: colors.onSurface }]}>{data.username}</Text>
        </View>

        <View style={styles.credentialGroup}>
          <View style={styles.infoRow}>
            <LockIcon size={18} color={colors.textMuted} />
            <Text style={[styles.label, { color: colors.textMuted }]}>Password</Text>
          </View>

          <View style={styles.passwordRow}>
            <Text
              style={[styles.value, styles.passwordValue, { color: colors.onSurface }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {showPassword ? data.password : '••••••••••••'}
            </Text>
            <TouchableOpacity
              testID="toggle-password-button"
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? (
                <EyeOffIcon size={20} color={colors.textMuted} />
              ) : (
                <EyeIcon size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticket: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  ticketTop: { padding: 24, paddingBottom: 20 },
  ticketBottom: { padding: 24, paddingTop: 20, gap: 20 },
  ticketDivider: { height: 30, justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  dashedLine: {
    height: 1,
    borderBottomWidth: 2,
    borderColor: 'rgba(150, 150, 150, 0.3)',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    marginHorizontal: 15,
  },
  cutout: { width: 30, height: 30, borderRadius: 15, position: 'absolute', top: 0, zIndex: 2 },
  cutoutLeft: { left: -15 },
  cutoutRight: { right: -15 },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  infoText: { fontSize: 16, fontWeight: '500' },
  credentialGroup: { position: 'relative', flexDirection: 'column' },
  label: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 18, fontWeight: '500', marginTop: 4, paddingLeft: 26 },
  passwordRow: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  passwordValue: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
    paddingLeft: 26,
    letterSpacing: 2,
    marginRight: 10,
  },
  eyeButton: { padding: 8, width: 40, alignItems: 'center' },
});
