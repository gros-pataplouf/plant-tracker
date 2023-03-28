from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

class AnonBurstRateThrottle(AnonRateThrottle):
    scope = 'burst'

class AnonSustainedRateThrottle(AnonRateThrottle):
    scope = 'sustained'