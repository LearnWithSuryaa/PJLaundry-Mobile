import { Star, User } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import type { Review } from "../../types/api";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../theme/tokens";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      {/* Top: Avatar, Name, Date, Service */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <User size={18} color={COLORS.brandBlueDark} />
        </View>

        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{review.customer_name}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Stars */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <Star
              key={starIndex}
              size={14}
              color={starIndex <= review.rating ? COLORS.brandOrange : COLORS.borderDefault}
              fill={starIndex <= review.rating ? COLORS.brandOrange : "transparent"}
            />
          ))}
        </View>
      </View>

      {/* Review Comment */}
      <Text style={styles.commentText}>"{review.comment}"</Text>

      {/* Service Tag */}
      {review.service_name ? (
        <View style={styles.tagRow}>
          <View style={styles.serviceTag}>
            <Text style={styles.serviceTagText}>Layanan: {review.service_name}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.brandBlueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm + 2,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  commentText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontStyle: "italic",
    marginVertical: SPACING.xs,
  },
  tagRow: {
    flexDirection: "row",
    marginTop: SPACING.xs + 2,
  },
  serviceTag: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  serviceTagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});

